package com.wandrr.modules.expenses;

import com.wandrr.modules.expenses.dto.BreakdownDTO;
import com.wandrr.modules.expenses.dto.MemberBalanceDTO;
import com.wandrr.modules.trips.Trip;
import com.wandrr.modules.trips.TripRepository;
import com.wandrr.modules.user.User;
import com.wandrr.modules.user.UserRepository;
import com.wandrr.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.io.ByteArrayOutputStream;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

@Service
@RequiredArgsConstructor
public class ExpenseReportService {

    private final ExpenseService expenseService;
    private final ExpenseRepository expenseRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    /**
     * Generates a PDF expense report.
     */
    public byte[] generateReport(UUID tripId, String requesterEmail) {
        User user = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found."));

        BreakdownDTO breakdown = expenseService.getFullBreakdown(tripId, requesterEmail);
        var summary = expenseService.getSummary(tripId, requesterEmail);

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, baos);
            document.open();

            // Fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.DARK_GRAY);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 11, BaseColor.BLACK);
            Font greenFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, new BaseColor(34, 139, 34));
            Font redFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, BaseColor.RED);

            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd MMM yyyy");

            // Title
            Paragraph title = new Paragraph("WANDRR EXPENSE REPORT", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // Meta
            document.add(new Paragraph("Trip: " + trip.getName(), normalFont));
            if (trip.getStartDate() != null && trip.getEndDate() != null) {
                document.add(new Paragraph("Dates: " + trip.getStartDate().format(fmt) + " — " + trip.getEndDate().format(fmt), normalFont));
            }
            document.add(new Paragraph("Generated: " + LocalDate.now().format(fmt), normalFont));
            document.add(new Paragraph("Generated for: " + user.getFullName(), normalFont));
            
            Paragraph totalPara = new Paragraph("\nTOTAL EXPENSES: ₹" + summary.getTotalExpenses().setScale(2).toPlainString(), titleFont);
            totalPara.setSpacingAfter(20);
            document.add(totalPara);

            // Settlement Plan
            document.add(new Paragraph("SETTLEMENT PLAN", headerFont));
            document.add(new Chunk("\n"));
            if (breakdown.isAllSettled()) {
                document.add(new Paragraph("All settled up! No pending transactions.", greenFont));
            } else {
                for (var s : breakdown.getSettlements()) {
                    document.add(new Paragraph(
                            s.getFrom().getFullName() + " pays ₹" + s.getAmount().setScale(2).toPlainString() + " → " + s.getTo().getFullName(),
                            normalFont));
                }
            }
            document.add(new Paragraph("\n"));

            // Member Balances Table
            document.add(new Paragraph("INDIVIDUAL BALANCES", headerFont));
            document.add(new Chunk("\n"));
            PdfPTable balanceTable = new PdfPTable(4);
            balanceTable.setWidthPercentage(100);
            balanceTable.addCell(new PdfPCell(new Phrase("Member", headerFont)));
            balanceTable.addCell(new PdfPCell(new Phrase("Paid", headerFont)));
            balanceTable.addCell(new PdfPCell(new Phrase("Share", headerFont)));
            balanceTable.addCell(new PdfPCell(new Phrase("Net Balance", headerFont)));

            for (var m : summary.getMembers()) {
                String name = m.getUser().getId().equals(user.getId()) ? "You (" + m.getUser().getFullName() + ")" : m.getUser().getFullName();
                balanceTable.addCell(new Phrase(name, normalFont));
                balanceTable.addCell(new Phrase("₹" + m.getTotalPaid().setScale(2).toPlainString(), normalFont));
                balanceTable.addCell(new Phrase("₹" + m.getTotalOwed().setScale(2).toPlainString(), normalFont));
                
                String netStr = (m.getNetBalance().compareTo(BigDecimal.ZERO) >= 0 ? "+" : "-") + "₹" + m.getNetBalance().abs().setScale(2).toPlainString();
                Font netFont = m.getNetBalance().compareTo(BigDecimal.ZERO) >= 0 ? greenFont : redFont;
                balanceTable.addCell(new Phrase(netStr, netFont));
            }
            document.add(balanceTable);
            document.add(new Paragraph("\n"));

            // Expenses Table
            List<Expense> expenses = expenseRepository.findByTripIdOrderByCreatedAtDesc(tripId);
            document.add(new Paragraph("EXPENSE LIST", headerFont));
            document.add(new Chunk("\n"));
            PdfPTable expenseTable = new PdfPTable(3);
            expenseTable.setWidthPercentage(100);
            expenseTable.addCell(new PdfPCell(new Phrase("Expense", headerFont)));
            expenseTable.addCell(new PdfPCell(new Phrase("Amount", headerFont)));
            expenseTable.addCell(new PdfPCell(new Phrase("Paid By", headerFont)));

            for (var e : expenses) {
                expenseTable.addCell(new Phrase(e.getTitle(), normalFont));
                expenseTable.addCell(new Phrase("₹" + e.getTotalAmount().setScale(2).toPlainString(), normalFont));
                expenseTable.addCell(new Phrase(e.getPaidBy().getFullName(), normalFont));
            }
            document.add(expenseTable);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF report", e);
        }
    }
}

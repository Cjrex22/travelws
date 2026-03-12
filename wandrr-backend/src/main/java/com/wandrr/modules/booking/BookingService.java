package com.wandrr.modules.booking;

import com.wandrr.modules.booking.dto.CreateBookingRequest;
import com.wandrr.modules.packages.TripPackage;
import com.wandrr.modules.packages.TripPackageService;
import com.wandrr.modules.user.User;
import com.wandrr.modules.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TripPackageService tripPackageService;
    private final UserService userService;

    public List<Booking> getMyBookings(String email) {
        User user = userService.getUserEntityByEmail(email);
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @Transactional
    public Booking createBooking(String email, CreateBookingRequest request) {
        User user = userService.getUserEntityByEmail(email);
        TripPackage tripPackage = tripPackageService.getPackageById(request.getPackageId());

        Booking booking = Booking.builder()
                .user(user)
                .tripPackage(tripPackage)
                .travelDate(request.getTravelDate())
                .totalPersons(request.getTotalPersons())
                .totalCost(tripPackage.getPricePerPerson() * request.getTotalPersons())
                .status("CONFIRMED")
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        if (request.getBuddyIds() != null && !request.getBuddyIds().isEmpty()) {
            List<BookingBuddy> buddies = request.getBuddyIds().stream().map(buddyId -> {
                User buddy = userService.getUserEntityById(buddyId);
                return BookingBuddy.builder()
                        .booking(savedBooking)
                        .buddy(buddy)
                        .status("INVITED")
                        .build();
            }).collect(Collectors.toList());
            
            savedBooking.setBuddies(buddies);
            // In a real app, emit notification event here to buddies
        }

        return bookingRepository.save(savedBooking);
    }
}

import java.net.URI;
import java.net.URLDecoder;
public class UriTest {
    public static void main(String[] args) throws Exception {
        URI uri = new URI("postgres://user:p%40ssword@host:5432/db");
        System.out.println("raw: " + uri.getRawUserInfo());
        System.out.println("decoded: " + uri.getUserInfo());
        System.out.println("url decoded: " + URLDecoder.decode(uri.getRawUserInfo(), "UTF-8"));
    }
}

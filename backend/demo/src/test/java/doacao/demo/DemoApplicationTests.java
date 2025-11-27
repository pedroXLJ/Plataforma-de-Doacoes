package doacao.demo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"spring.datasource.url=jdbc:h2:mem:testdb",
		"spring.datasource.driver-class-name=org.h2.Driver",
		"spring.jpa.hibernate.ddl-auto=create-drop",
		"app.jwt.secret=testssecretkeytestssecretkeytestssecret",
		"app.jwt.expiration-ms=3600000"
})
class DemoApplicationTests {

	@Test
	void contextLoads() {
	}

}

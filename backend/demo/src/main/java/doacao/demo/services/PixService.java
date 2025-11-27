package doacao.demo.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import doacao.demo.config.PagSeguroConfig;
import doacao.demo.DTOs.PixResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class PixService {

    private final PagSeguroConfig config;
    private final ObjectMapper mapper = new ObjectMapper();
    private static final Logger logger = LoggerFactory.getLogger(PixService.class);

    public PixService(PagSeguroConfig config) {
        this.config = config;
    }

    public PixResponseDTO criarPix(String referencia, double valor) throws Exception {
        HttpClient client = HttpClient.newHttpClient();

        int valorCentavos = (int) (valor * 100);

        String json = """
        {
          "reference_id": "%s",
          "customer": {
            "name": "Doação PagSeguro"
          },
          "items": [
            {
              "name": "Doação",
              "quantity": 1,
              "unit_amount": %d
            }
          ],
          "qr_codes": [
            {
              "amount": { "value": %d }
            }
          ]
        }
        """.formatted(referencia, valorCentavos, valorCentavos);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(PagSeguroConfig.BASE_URL + "orders"))
                .header("Authorization", config.getToken())
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        logger.info("PagSeguro Response Status: {}", response.statusCode());
        logger.info("PagSeguro Response Body: {}", response.body());

        JsonNode jsonNode = mapper.readTree(response.body());

        // Verificar se há erro na resposta
        if (response.statusCode() >= 400) {
            throw new Exception("Erro PagSeguro: " + response.body());
        }

        // Extrair dados com segurança
        String orderId = jsonNode.has("id") ? jsonNode.get("id").asText() : "N/A";
        String qrCodeText = "N/A";
        String qrCodeImage = "N/A";

        if (jsonNode.has("qr_codes") && jsonNode.get("qr_codes").isArray() && jsonNode.get("qr_codes").size() > 0) {
            JsonNode qrCode = jsonNode.get("qr_codes").get(0);
            qrCodeText = qrCode.has("text") ? qrCode.get("text").asText() : "N/A";
            qrCodeImage = qrCode.has("base64") ? qrCode.get("base64").asText() : "N/A";
        }

        return new PixResponseDTO(orderId, qrCodeText, qrCodeImage);
    }
}
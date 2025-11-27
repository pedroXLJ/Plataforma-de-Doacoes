package doacao.demo.DTOs;

public record PixResponseDTO(
        String orderId,
        String qrCodeText,
        String qrCodeImage
) {}
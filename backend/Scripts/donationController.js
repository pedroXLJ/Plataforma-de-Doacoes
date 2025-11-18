const pool = require("./db.js");
const axios = require("axios");
require("dotenv").config({ path: "../.env" });

module.exports = {
    async createDonation(req, res) {
        try {
            const { name, email, amount } = req.body;

            const result = await pool.query(
                "INSERT INTO donations(name, email, amount, status) VALUES($1, $2, $3, $4) RETURNING *",
                [name, email, amount, "pending"]
            );

            // Criar pedido no PagSeguro
            const payment = await axios.post(
                "https://sandbox.api.pagseguro.com/orders",
                {
                    reference_id: result.rows[0].id,
                    customer: { name, email },
                    items: [
                        {
                            name: "Doação",
                            quantity: 1,
                            unit_amount: amount * 100 // centavos
                        }
                    ]
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.PAGSEGURO_TOKEN}`,
                        "Content-Type": "application/json",
                    }
                }
            );

            return res.json({
                donation: result.rows[0],
                checkout_url: payment.data.links[1].href
            });

        } catch (error) {
            console.log(error.response?.data || error);
            res.status(500).json({ error: "Erro ao criar doação" });
        }
    },

    async pagseguroWebhook(req, res) {
        console.log("WEBHOOK:", req.body);
        res.sendStatus(200);
    }
};

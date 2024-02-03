const { Webhook } = require("discord-webhook-node");

async function sendWebhook(embed) {
  const webhookUrl = "https://discord.com/api/webhooks/1203467328969244783/Q9ojH6D8iLhbCFuUczidqTwPp1GFPJeY5_gRPyQRH7GIx_mt_k0tKFt3kEPqRuIaBUgT";  // Substitua isso pelo seu link de webhook

  try {
    await new Webhook(webhookUrl).send(embed);
  } catch (error) {
    console.error(`[LOGGER] Erro ao enviar o webhook: ${error.message}`);
    throw error;
  }
}

module.exports = { sendWebhook };

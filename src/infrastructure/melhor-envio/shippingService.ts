import addressRepository from "../../modules/address/address.repository";

const DEFAULT_PACKAGE = {
  weight: 1,      // kg
  width: 16,      // cm
  height: 12,     // cm
  length: 20,     // cm
};

const STORE_CEP = process.env.STORE_CEP!; // CEP do seu estoque/loja

export const shippingService = {
  async getOptions(addressId: number) {
    const address = await addressRepository.findUnique({ id: addressId });

    if (!address) {
      throw new Error('Endereço não encontrado');
    }

    console.log(address.zip)

    const payload = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'App minha-loja (contato@minhaloja.com)',
      },
      body: JSON.stringify({
        from: {
          postal_code: STORE_CEP,
        },
        to: {
          postal_code: address.zip,
        },
        package: DEFAULT_PACKAGE,
      }),
    }

    console.log(payload)

    const res = await fetch('https://melhorenvio.com.br/api/v2/me/shipment/calculate', payload);

    if (!res.ok) {
      const error = await res.json();
      console.log('Melhor Envio error:', JSON.stringify(error, null, 2));
      throw new Error(`Erro ao calcular frete: ${res.statusText}`);
    }

    const options = await res.json();

    const valid = options.filter((o: any) => !o.error);

    if (!valid.length) {
      throw new Error('Nenhuma opção de frete disponível para esse endereço');
    }

    const cheapest = valid.sort((a: any, b: any) => a.price - b.price)[0];

    return Number(cheapest.price);
  },

  async validateZipExists(zip: string): Promise<boolean> {
    const cleaned = zip.replace(/\D/g, '');
    
    if (cleaned.length !== 8) return false;

    const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
    const data = await res.json();

    return !data.erro;
  }
};
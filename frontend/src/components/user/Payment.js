// src/components/Payment.js
import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const Payment = () => {
  return (
    <PayPalScriptProvider options={{ "client-id": "test" }}>
      <div style={{ maxWidth: '400px', margin: 'auto', padding: '50px 20px' }}>
        <h2>Paiement sécurisé via PayPal</h2>
        <PayPalButtons
          style={{ layout: 'vertical', color: 'blue', shape: 'pill', label: 'checkout' }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: "19.99", // 💰 montant en USD
                },
              }],
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then(details => {
              alert(`Paiement effectué par ${details.payer.name.given_name}`);
              console.log('🧾 Détails du paiement :', details);
            });
          }}
          onError={(err) => {
            console.error("❌ Erreur PayPal :", err);
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default Payment;

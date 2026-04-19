import React from 'react';
import {
Box, Typography, Container, Divider, Button, List, ListItem, ListItemText
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { Package, Monitor, RefreshCw } from 'lucide-react'; // Using lucide-react for icons


const StyledContainer = styled(Container)(({ theme }) => ({
padding: theme.spacing(4),
backgroundColor: '#f5f7fa',
minHeight: 'calc(100vh - 64px)',
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
}));

const ContentBox = styled(Box)(({ theme }) => ({
backgroundColor: '#fff',
borderRadius: '8px',
border: '1px solid #e0e0e0',
padding: theme.spacing(4),
maxWidth: 800,
width: '100%',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
fontWeight: 700,
color: '#00c4b4',
marginTop: theme.spacing(3),
marginBottom: theme.spacing(1),
display: 'flex',
alignItems: 'center',
}));

const StyledButton = styled(Button)(({ theme }) => ({
backgroundColor: '#00c4b4',
color: '#fff',
borderRadius: '8px',
textTransform: 'none',
padding: theme.spacing(1, 3),
fontWeight: 600,
'&:hover': {
backgroundColor: '#00a89a',
},
}));

const RefundPolicy = () => {
const navigate = useNavigate();

return (
<StyledContainer>
<ContentBox>
<Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 2 }}>
Politique de remboursement – eShop
</Typography>
<Typography variant="body1" sx={{ color: '#555', mb: 3 }}>
Chez eShop, la satisfaction de nos clients est une priorité. Si vous n’êtes pas
entièrement satisfait de votre commande, vous avez la possibilité de demander un
remboursement sous certaines conditions.
</Typography>

<Divider sx={{ mb: 3 }} />

{/* Section 1: Produits physiques */}
<SectionTitle variant="h5">
<Package size={24} style={{ marginRight: 8 }} />
Produits physiques
</SectionTitle>
<Typography variant="body1" sx={{ color: '#555', mb: 1 }}>
Vous disposez d’un délai de 14 jours après la réception de votre commande pour retourner
un produit. Pour être éligible à un remboursement :
</Typography>
<List dense>
<ListItem>
<ListItemText
primary="Le produit doit être non utilisé, en parfait état et dans son emballage d’origine."
primaryTypographyProps={{ color: '#555' }}
/>
</ListItem>
<ListItem>
<ListItemText
primary="Les articles retournés incomplets, endommagés ou ayant été utilisés ne pourront pas être remboursés."
primaryTypographyProps={{ color: '#555' }}
/>
</ListItem>
</List>
<Typography variant="body2" sx={{ color: '#888', fontStyle: 'italic', mb: 2 }}>
Exemple : Si vous commandez une paire de chaussures et qu’elle ne vous convient pas, vous
pouvez nous la retourner dans les 14 jours, tant qu’elle n’a pas été portée et que la
boîte est intacte.
</Typography>

{/* Section 2: Produits numériques */}
<SectionTitle variant="h5">
<Monitor size={24} style={{ marginRight: 8 }} />
Produits numériques
</SectionTitle>
<Typography variant="body1" sx={{ color: '#555', mb: 1 }}>
Pour les produits numériques (comme des fichiers téléchargeables, cartes-cadeaux ou
formations), les remboursements ne sont possibles que si le téléchargement n’a pas été
effectué. Une fois le fichier téléchargé ou le contenu consulté, aucun remboursement ne
sera accordé.
</Typography>
<Typography variant="body2" sx={{ color: '#888', fontStyle: 'italic', mb: 2 }}>
Exemple : Si vous achetez un e-book mais décidez de ne pas le télécharger, vous pouvez
demander un remboursement dans un délai de 48 heures.
</Typography>

{/* Section 3: Procédure de remboursement */}
<SectionTitle variant="h5">
<RefreshCw size={24} style={{ marginRight: 8 }} />
Procédure de remboursement
</SectionTitle>
<List dense>
<ListItem>
<ListItemText
primary="Rendez-vous sur notre page Contact ou accédez directement à votre compte client."
primaryTypographyProps={{ color: '#555' }}
/>
</ListItem>
<ListItem>
<ListItemText
primary="Sélectionnez la commande concernée et cliquez sur “Demander un remboursement”."
primaryTypographyProps={{ color: '#555' }}
/>
</ListItem>
<ListItem>
<ListItemText
primary="Remplissez le formulaire avec :"
primaryTypographyProps={{ color: '#555' }}
/>
</ListItem>
<List sx={{ pl: 4 }}>
<ListItem>
<ListItemText
primary="Votre nom complet"
primaryTypographyProps={{ color: '#555' }}
/>
</ListItem>
<ListItem>
<ListItemText
primary="Votre adresse e-mail"
primaryTypographyProps={{ color: '#555' }}
/>
</ListItem>
<ListItem>
<ListItemText
primary="Le numéro de commande"
primaryTypographyProps={{ color: '#555' }}
/>
</ListItem>
<ListItem>
<ListItemText
primary="La raison de la demande"
primaryTypographyProps={{ color: '#555' }}
/>
</ListItem>
</List>
<ListItem>
<ListItemText
primary="Si un retour physique est nécessaire, nous vous enverrons les instructions et l’adresse de retour."
primaryTypographyProps={{ color: '#555' }}
/>
</ListItem>
<ListItem>
<ListItemText
primary="Une fois le produit reçu et vérifié, le remboursement sera effectué sous 7 à 10 jours ouvrés sur le même moyen de paiement utilisé lors de l’achat."
primaryTypographyProps={{ color: '#555' }}
/>
</ListItem>
</List>

<Divider sx={{ my: 3 }} />

<Typography variant="body1" sx={{ color: '#555', mb: 2, textAlign: 'center' }}>
Pour toute question, n’hésitez pas à contacter notre service client. Nous sommes là pour
vous aider !
</Typography>
<Box sx={{ display: 'flex', justifyContent: 'center' }}>
<StyledButton onClick={() => navigate('/contact')}>
Contactez-nous
</StyledButton>
</Box>
</ContentBox>
</StyledContainer>
);
};

export default RefundPolicy;
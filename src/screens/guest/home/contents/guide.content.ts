const GuideContent = [
	{
		image: () => require('@Asset/static/img/dog1.jpg'),
		title: 'Bienvenue sur l\'application',
		subtitle: ' Good Sitter',
		endtitle: ' !',
		text: 'Une application 100% chiens et chats qui regroupe tous les services de pet-sitting pour vous.',
		info: 'Faites glisser vers la gauche pour continuer.'
	},
	{
		image: () => require('@Asset/static/img/dog2.jpg'),
		title: 'Des services de',
		subtitle: ' proximité',
		text: 'Trouvez des pet-sitters de confiance\nprès de chez vous.\n\nRéservez une promenade, une garde à domicile ou un hébergement.'
	},
	{
		image: () => require('@Asset/static/img/cat1.jpg'),
		title: 'Restez en',
		subtitle: ' contact',
		endtitle: ' avec votre pet-sitter',
		text: 'Discutez avec votre pet-sitter et suivez en temps réel l\'itinéraire des promenades.\n\nRecevez des photos de votre animal quel que soit le service que vous réserverez.'
	},
	{
		image: () => require('@Asset/static/img/dog3.jpg'),
		title: 'Confiance et ',
		subtitle: ' sécurité',
		text: 'Chaque pet-sitter a été vérifié à la fois par nos équipes et par un système de vérification d\'identité numérique.\n\nVous pouvez également signaler et bloquer les personnes agissant de manière inappropriée.\n\nVos données personnelles sont sécurisés et ne seront, en aucun cas, vendues à des tiers.\nToutes vos transactions sont cryptées et certifiées PCI-DSS avec la plateforme Stripe.'
	}
]

export default GuideContent

import React from "react";
import {
	Box,
	Container,
	Heading,
	Text,
	VStack,
	UnorderedList,
	ListItem,
	Link,
	Button,
	Image,
	Card,
	Divider,
} from "@chakra-ui/react";

const PrivacyPolicy = () => {
	return (
		<Box bg="gray.50" minHeight="100vh" py={12}>
			<Container maxW="container.md">
				<VStack spacing={5} align="stretch">
					<Heading as="h1" size="2xl" textAlign="center">
						Privacy Policy
					</Heading>

					<Text color="gray.600">
						Last updated: {new Date().toLocaleDateString()}
					</Text>

					<Section title="1. Introduction">
						<Text>
							Welcome to Meddy ("we," "our," or "us"). This Privacy Policy
							governs your use of the Meddy application and related services
							(collectively, the "Service"). By using the Service, you agree to
							the collection, use, disclosure, and procedures this Privacy
							Policy describes.
						</Text>
					</Section>

					<Section title="2. Information We Collect">
						<Text>We collect the following types of information:</Text>
						<UnorderedList ml={5} mt={2}>
							<ListItem>
								Personal information (e.g., name, email address, phone number)
							</ListItem>
							<ListItem>
								Health and fitness data from Google Fitness (with your explicit
								consent)
							</ListItem>
							<ListItem>Usage data and analytics</ListItem>
							<ListItem>Any other information you choose to provide</ListItem>
						</UnorderedList>
					</Section>

					<Section title="3. How We Use Your Information">
						<Text>We use your information for the following purposes:</Text>
						<UnorderedList ml={5} mt={2}>
							<ListItem>To provide, maintain, and improve our Service</ListItem>
							<ListItem>
								To personalize your experience and deliver tailored content
							</ListItem>
							<ListItem>To communicate with you about our Service</ListItem>
							<ListItem>
								To analyze usage patterns and optimize our Service
							</ListItem>
							<ListItem>To comply with legal obligations</ListItem>
						</UnorderedList>
					</Section>

					<Section title="4. Legal Basis for Processing (EU Users)">
						<Text>
							For users in the European Union, we process your personal data
							based on the following legal grounds:
						</Text>
						<UnorderedList ml={5} mt={2}>
							<ListItem>Your consent</ListItem>
							<ListItem>Performance of a contract</ListItem>
							<ListItem>Our legitimate interests</ListItem>
							<ListItem>Compliance with legal obligations</ListItem>
						</UnorderedList>
					</Section>

					<Section title="5. Data Sharing and Disclosure">
						<Text>
							We may share your information with third parties in the following
							circumstances:
						</Text>
						<UnorderedList ml={5} mt={2}>
							<ListItem>With your consent</ListItem>
							<ListItem>With service providers and business partners</ListItem>
							<ListItem>To comply with legal obligations</ListItem>
							<ListItem>
								In connection with a merger, sale, or acquisition
							</ListItem>
						</UnorderedList>
					</Section>

					<Section title="6. Data Retention and Deletion">
						<Text>
							We retain your data for 30 days, after which it is automatically
							deleted from our active systems. You may request earlier deletion
							by contacting privacy@trymeddy.com. We will process your request
							within 30 days, subject to legal requirements.
						</Text>
					</Section>

					<Section title="7. Your Rights and Choices">
						<Text>
							Depending on your location, you may have certain rights regarding
							your personal data, including:
						</Text>
						<UnorderedList ml={5} mt={2}>
							<ListItem>Access and portability</ListItem>
							<ListItem>Correction and deletion</ListItem>
							<ListItem>Withdrawal of consent</ListItem>
							<ListItem>Objection to processing</ListItem>
						</UnorderedList>
						<Text mt={2}>
							To exercise these rights, please contact us at
							privacy@trymeddy.com.
						</Text>
					</Section>

					<Section title="8. Security">
						<Text>
							We implement reasonable security measures to protect your
							information. However, no method of transmission or storage is 100%
							secure. We cannot guarantee absolute security of your data.
						</Text>
					</Section>

					<Section title="9. Children's Privacy">
						<Text>
							Our Service is not directed to children under 13. We do not
							knowingly collect personal information from children under 13. If
							you believe we have collected such information, please contact us
							immediately.
						</Text>
					</Section>

					<Section title="10. Changes to This Privacy Policy">
						<Text>
							We may update this Privacy Policy from time to time. We will
							notify you of any changes by posting the new Privacy Policy on
							this page and updating the "Last updated" date.
						</Text>
					</Section>

					<Section title="11. Contact Us">
						<Text>
							For questions or concerns about this Privacy Policy, please
							contact us at:
						</Text>
						<Text mt={2}>
							<Link href="mailto:privacy@trymeddy.com" color="blue.500">
								privacy@trymeddy.com
							</Link>
						</Text>
					</Section>

					<Text fontStyle="italic" mt={8}>
						By using our Service, you acknowledge that you have read and
						understood this Privacy Policy and agree to its terms.
					</Text>
				</VStack>
			</Container>
			<Button
				onClick={() => {
					window.history.back();
				}}
				leftIcon={
					<Image src="/assets/svg-9b.svg" boxSize="1.5rem" alt="Back icon" />
				}
				variant="outline"
				mt={8}
			>
				Take me back
			</Button>
		</Box>
	);
};

const Section = ({ title, children }) => (
	<Card p={4} border="1px solid" borderRadius="md">
		<Heading as="h2" size="lg" mb={2}>
			{title}
		</Heading>
		<Divider mb={4} />
		<Box>{children}</Box>
	</Card>
);

export default PrivacyPolicy;

// Sample 1: Basic user with some medical data
export const sampleData1 = {
	user: {
		userid: "user123",
		name: "John Doe",
		address: "123 Main St, Anytown, USA 12345",
		email: "john.doe@email.com",
		language: "en",
		phone: "1234567890",
	},
	chatHistory: [
		{ role: "user", content: "What are my current medications?" },
		{
			role: "assistant",
			content:
				"Your current medications are: Lisinopril 10mg and Metformin 500mg.",
		},
	],
	medications: ["Lisinopril 10mg", "Metformin 500mg"],
	appointments: [
		{
			id: "apt1",
			doctorId: "doc1",
			dateTime: "2023-07-15T10:00:00Z",
			description: "Annual checkup",
		},
	],
	reminders: [
		{
			id: "rem1",
			medicationName: "Lisinopril",
			hoursUntilRepeat: 24,
			time: "09:00",
		},
	],
};

// Sample 2: User with multiple appointments and medications
export const sampleData2 = {
	user: {
		userid: "user456",
		name: "Jane Smith",
		address: "456 Elm St, Othertown, USA 67890",
		email: "jane.smith@email.com",
		language: "es",
		phone: "9876543210",
	},
	chatHistory: [
		{ role: "user", content: "Cuándo es mi próxima cita?" },
		{
			role: "assistant",
			content:
				"Su próxima cita es el 20 de julio a las 2:00 PM con el Dr. Johnson.",
		},
	],
	medications: ["Atorvastatin 20mg", "Levothyroxine 50mcg", "Aspirin 81mg"],
	appointments: [
		{
			id: "apt2",
			doctorId: "doc2",
			dateTime: "2023-07-20T14:00:00Z",
			description: "Follow-up",
		},
		{
			id: "apt3",
			doctorId: "doc3",
			dateTime: "2023-08-05T11:00:00Z",
			description: "Specialist consultation",
		},
	],
	reminders: [
		{
			id: "rem2",
			medicationName: "Atorvastatin",
			hoursUntilRepeat: 24,
			time: "20:00",
		},
		{
			id: "rem3",
			medicationName: "Levothyroxine",
			hoursUntilRepeat: 24,
			time: "07:00",
		},
	],
};

// Sample 3: User with no current medications or appointments
export const sampleData3 = {
	user: {
		userid: "user789",
		name: "Bob Johnson",
		address: "789 Oak Rd, Somewhere, USA 13579",
		email: "bob.johnson@email.com",
		language: "en",
		phone: "5551234567",
	},
	chatHistory: [
		{ role: "user", content: "Do I have any upcoming appointments?" },
		{
			role: "assistant",
			content: "You currently don't have any scheduled appointments.",
		},
	],
	medications: [],
	appointments: [],
	reminders: [],
};

// Sample 4: User with complex medical history
export const sampleData4 = {
	user: {
		userid: "user101",
		name: "Alice Brown",
		address: "101 Pine Lane, Elsewhere, USA 24680",
		email: "alice.brown@email.com",
		language: "fr",
		phone: "1112223333",
	},
	chatHistory: [
		{ role: "user", content: "Pouvez-vous me rappeler mes allergies?" },
		{
			role: "assistant",
			content: "Vos allergies enregistrées sont : pénicilline et arachides.",
		},
	],
	medications: [
		"Insulin Glargine 100 units/mL",
		"Metoprolol 25mg",
		"Fluoxetine 20mg",
	],
	appointments: [
		{
			id: "apt4",
			doctorId: "doc4",
			dateTime: "2023-07-25T09:30:00Z",
			description: "Endocrinologist",
		},
		{
			id: "apt5",
			doctorId: "doc5",
			dateTime: "2023-08-10T13:15:00Z",
			description: "Cardiologist",
		},
	],
	reminders: [
		{
			id: "rem4",
			medicationName: "Insulin",
			hoursUntilRepeat: 12,
			time: "08:00",
		},
		{
			id: "rem5",
			medicationName: "Insulin",
			hoursUntilRepeat: 12,
			time: "20:00",
		},
		{
			id: "rem6",
			medicationName: "Metoprolol",
			hoursUntilRepeat: 12,
			time: "09:00",
		},
	],
	allergies: ["Penicillin", "Peanuts"],
	conditions: ["Type 2 Diabetes", "Hypertension", "Depression"],
};

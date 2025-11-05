# **App Name**: TourVista Admin

## Core Features:

- Dashboard Overview: Provides a summarized view of key metrics like total tourist places, cultural events, and pending submissions.
- Tourist Place Management: Allows admins to view, edit, and verify tourist place information (name, city, state) fetched from the 'touristplaces' collection. Displays one image per place fetched from the 'images' collection using the 'placeId'.
- Cultural Event Management: Enables admins to view, edit, and verify cultural event details fetched from the 'culturalfest' collection. Displays one image per event fetched from the 'images' collection using the 'placeId'.
- Submission Review: Presents a list of submitted tourist places from the 'touristplacesverify' collection for admin review and approval. Admins can view all details associated with the submission.
- Data Filtering: Allows admin user to filter results displayed on different pages by name, state or city of tourism places and/or cultural events
- Content Generation: Generates a description of a tourist location using a generative AI tool based on its coordinates, landmarks and nearby infrastructure. It provides this context to a language model, so the AI tool can provide accurate output.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to inspire trust and confidence.
- Background color: Light gray (#F5F5F5) to maintain a clean and professional look.
- Accent color: Purple (#9C27B0) to add a touch of sophistication and highlight key actions.
- Body and headline font: 'Inter', a sans-serif, to create a modern, objective, and neutral feel suitable for both headlines and body text.
- Use clear and professional icons from a consistent set (e.g., Material Design Icons) to aid navigation and represent different data types.
- Implement a responsive layout with a fixed sidebar for primary navigation and card-based designs for data display to ensure usability across devices.
- Use subtle transitions and animations to provide feedback on user interactions (e.g., button hovers, loading states) without being distracting.
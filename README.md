# PixelPulse - AI-Powered Image Generator

An AI-powered image and content generation application built with Next.js and Google's Gemini AI.

## Features

- **AI Image Generation**: Create images from text descriptions
- **Text-to-Image**: Transform your ideas into visual content
- **Image-to-Image**: Upload an image for AI-enhanced transformations
- **Multi-modal AI**: Leverage Google Gemini's powerful multi-modal capabilities
- **Modern UI**: Clean, responsive interface with animations

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, shadcn/ui components
- **State Management**: Redux Toolkit
- **Animations**: Framer Motion
- **AI**: Google Gemini AI

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Google Gemini API key (get it from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your Gemini API key:

```
GOOGLE_GENAI_API_KEY=your_api_key_here
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Navigate to the AI Generator page
2. Enter a detailed prompt describing what you want to create
3. Optionally upload an image to enhance or transform
4. Click "Generate" and wait for the AI to create your content
5. View and download the generated text and images

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

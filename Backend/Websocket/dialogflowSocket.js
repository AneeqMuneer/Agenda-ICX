import dialogflow from "@google-cloud/dialogflow";

// Session variable to manage dialogflow sessions
const sessionClient = new dialogflow.SessionsClient();

export const detectIntent = async (sessionId, message) => {

    // Input validations
    if (!sessionId || typeof sessionId !== "string") {
        throw new Error("Invalid sessionId provided to detectIntent");
    }

    if (!message || typeof message !== "string" || message.trim() === "") {
        throw new Error("Invalid or empty message provided to detectIntent");
    }

    // Checking if env variables are set
    if (!process.env.DIALOGFLOW_PROJECT_ID) {
        throw new Error("DIALOGFLOW_PROJECT_ID is not set in environment variables");
    }

    // Querying the bot with the user message
    const sessionPath = sessionClient.projectAgentSessionPath(
        process.env.DIALOGFLOW_PROJECT_ID,
        sessionId
    );

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: message.trim(),
                languageCode: "en",
            },
        },
    };

    try {
        // Extracting the bot response from the dialogflow output
        const [response] = await sessionClient.detectIntent(request);
        
        if (response == null) {
            throw new Error("Response received from bot is null or undefined");
        }

        const result = response.queryResult;

        if (result == null) {
            throw new Error("queryResult is null or undefined in Dialogflow response");
        }

        // Guard: fulfillmentText can be empty if intent has no response configured
        if (!result.fulfillmentText || result.fulfillmentText.trim() === "") {
            throw new Error("Dialogflow returned an empty fulfillmentText — check intent responses in Dialogflow console");
        }

        console.log(`Intent: ${result.intent.displayName}\n`);
        console.log(`Bot Response: ${result.fulfillmentText}\n`);

        return result.fulfillmentText;

    } catch (error) {
        // Catch specific Dialogflow API error codes for better debugging
        if (error.code === 401) {
            console.error("Dialogflow Auth Error: Service account credentials are invalid or expired");
        } else if (error.code === 403) {
            console.error("Dialogflow Permission Error: Service account does not have Dialogflow API Client role");
        } else if (error.code === 404) {
            console.error("Dialogflow Not Found Error: Project ID is incorrect or agent does not exist");
        } else {
            console.error("Error calling Dialogflow:", error.message);
        }

        throw new Error(`Dialogflow detectIntent failed: ${error.message}`);
    }
};
"use server";

/* eslint-disable no-tabs */
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export async function correctCode(code: string): Promise<string> {
    const prompt = `
		Given the following code snippet, please correct any syntax errors and add formatting to it (e.g. newlines, tabs, etc.):
		For example, let's say the input code is:
		
		#include <iostream>
		using namespace std;
		int main() {
		cout << "Hello There!" << endl;
		return 0;

		Then the output should be:
		#include <iostream>
		using namespace std;
		int main() {
		\tcout << "Hello There!" << endl;
		\treturn 0;
		}

		Where the code is correctly formatted with proper indentation (missing tab "\t" characters) and syntax (missing curly brace at the end).

		Do not change the code logic, only correct syntax errors and add formatting. You can add things like newlines, tabs, spaces, etc. to make the code more readable.

		Here is the code snippet to correct:
		${code}

		Only return the corrected code, do not include the prompt or any other text in the output. 
    `;

    const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-latest",
        max_tokens: 1024,
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
    }) as Anthropic.Message & { content: { text: string }[] };

    const res = message.content[0]?.text;

    return res;
}

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "jackyVSCode" is now active!');

	let disposable = vscode.commands.registerCommand('jackyVSCode.helloWorld', async () => {
		let input = await vscode.window.showInputBox({
			prompt: "ENTER AN INSTAGRAM USERNAME",
			placeHolder: "@instagram",
		});
		vscode.window.showInformationMessage(`https://www.instagram.com/${input.includes("@") ? input.substring(1, input.length) : input}/?__a=1 PASTE THE CONTENTS OF THIS WEBPAGE INTO THE INPUT BOX`)
		
		let instagramJson = "";
		async function getJson () {
			instagramJson = await vscode.window.showInputBox({
				prompt: `PASTE THE CONTENTS OF https://www.instagram.com/${input.includes("@") ? input.substring(1, input.length) : input}/?__a=1 HERE`,
				placeHolder: "website contents",
			});
			if(instagramJson === "" || instagramJson === undefined) {
				setTimeout(() => getJson(), 5000);
			} else {
				showImage();
			}
		}
		getJson();

		function showImage () {
			let images = [];
			try{
				var src = JSON.parse(instagramJson)["graphql"]["user"]["edge_owner_to_timeline_media"]["edges"]
				for(var i in src) {
					images.push(src[i]["node"]["display_url"]);
				}
			} catch (e) {
				vscode.window.showInformationMessage(`an error occured, the instagram username (${input}) my be invalid`);
			}
			setInterval(async () => {
				const panel = vscode.window.createWebviewPanel("test", "Instagram Viewer", vscode.ViewColumn.Beside);
				panel.webview.html = await getInstaUrl(images[Math.floor(Math.random() * images.length)], input !== undefined ? input : "@instagram");
			}, 600000);
			//showImage();
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

async function getInstaUrl(url: String, username: String): Promise<string> {
	return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Cat Coding</title>
	</head>
	<body>
	<h1>@${username}</h1>
	<img src="${url}" alt="sheeeeesh" width="500" height="auto">
	</body>
	</html>
	`
}


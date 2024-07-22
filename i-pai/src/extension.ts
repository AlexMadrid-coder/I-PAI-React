// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const provider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('ipai.mainContainer', provider)
	);
}
class SidebarProvider implements vscode.WebviewViewProvider{
	constructor(private readonly _extensionUri: vscode.Uri) {}

	public resolveWebviewView(
		webviewView: vscode.WebviewView, 
		context: vscode.WebviewViewResolveContext, 
		token: vscode.CancellationToken)
		{
			webviewView.webview.options = {
				// Permitimos le ejecución de scripts de la vista
				enableScripts: true,
				// Configuramos permisos para la carga de recursos locales
				localResourceRoots: 
				[
					vscode.Uri.joinPath(this._extensionUri, 'media'), 
				],
			
			};

			// Configuramos el contenido del webview
			const indexPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'index.html');
			let html = fs.readFileSync(indexPath.fsPath, 'utf-8');
			// Sacamos las URI para los CSS, JS e imagenes
			const jsBaseURI 	= webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'scripts'));
			const cssBaseURI 	= webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'styles'));
			const iconsBaseURI 	= webviewView.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media','img'));
			// Reemplazamos para tener las URI correctas usando expresiones regulares y el formato especial en el fichero donde las declaramos
			html = html.replace(/\${jsBaseUri}/g, 		`${jsBaseURI}`);
			html = html.replace(/\${cssBaseUri}/g, 		`${cssBaseURI}`);
			html = html.replace(/\${iconsBaseURI}/g, 	`${iconsBaseURI}`);
			webviewView.webview.html = html;
		}
}


// This method is called when your extension is deactivated

export function deactivate() {}

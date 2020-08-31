import * as vscode from 'vscode'
import type {LinkToCode} from './link'

export class LinkResolver {

    async toUri(link: LinkToCode, dir?: vscode.WorkspaceFolder): Promise<vscode.Uri | undefined> {
        if (dir) {
         return this.findFile(link, dir)
        }
        const curDocUri = vscode.window.activeTextEditor?.document.uri
        if (curDocUri) {
            const curFoler = vscode.workspace.getWorkspaceFolder(curDocUri)
            if (curFoler) {
                return this.findFile(link, curFoler)
            }
        }
        if (!vscode.workspace.workspaceFolders) {
            return undefined
        }
        for(const folder of vscode.workspace.workspaceFolders) {
            const ret = await this.findFile(link, folder)
            if (ret) {
                return ret
            }
        }
        return undefined
    }

    private async findFile(link: LinkToCode, dir: vscode.WorkspaceFolder) {
        const uri = vscode.Uri.joinPath(dir.uri, '.', link.path)
        try {
            await vscode.workspace.fs.stat(uri)
            return uri
        } catch {
            return undefined
        }
    }

}
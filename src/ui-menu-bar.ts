import { QAction, QMenu, QMenuBar } from "@nodegui/nodegui";

export interface MenuConfig {
    title: string;
    actions: 
        {
            text: string;
            signal: "triggered" | "changed" | "hovered" | "toggled" | "objectNameChanged";
            event: () => void;
        }[];
}

export class NwMenuBar extends QMenuBar {
    constructor(config: MenuConfig[]) {
        super();

        config.forEach(c => {
            const menu = new QMenu();
            menu.setTitle(c.title);
            c.actions.forEach(a => {
                const action = new QAction();
                action.setText(a.text);
                action.addEventListener(a.signal, a.event);
                menu.addAction(action);
            });
            this.addMenu(menu);
        });
    }
}
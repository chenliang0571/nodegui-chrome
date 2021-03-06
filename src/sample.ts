import { FlexLayout, QIcon, QLabel, QMainWindow, QPushButton, QWidget } from "@nodegui/nodegui";
import logo from '../assets/logox200.png';

export class SimpleWin extends QMainWindow {
    constructor() {
        super();
        this.setWindowTitle("SimpleWin")

        const centralWidget = new QWidget();
        centralWidget.setObjectName("myroot");
        const rootLayout = new FlexLayout();
        centralWidget.setLayout(rootLayout);

        const label = new QLabel();
        label.setObjectName("mylabel");
        label.setText("Hello");

        const button = new QPushButton();
        button.setIcon(new QIcon(logo));

        const label2 = new QLabel();
        label2.setText("World");
        label2.setInlineStyle(`
        color: red;
        `);

        rootLayout.addWidget(label);
        rootLayout.addWidget(button);
        rootLayout.addWidget(label2);
        this.setCentralWidget(centralWidget);
        this.setStyleSheet(
            `
            #myroot {
            background-color: #009688;
            height: '100%';
            align-items: 'center';
            justify-content: 'center';
            }
            #mylabel {
            font-size: 16px;
            font-weight: bold;
            padding: 1;
            }
        `
        );
    }
}
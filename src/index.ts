// import { SimpleWin } from './sample';
import { Client } from "./client";

// const win = new SimpleWin();
const win = new Client();
win.show();

(global as any).win = win;

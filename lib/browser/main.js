import app from 'app'
import BrowserWindow from 'browser-window'
import path from 'path'

const INDEX_HTML = path.join(process.cwd(),'dist/index.html')
const WINDOW_OPTS = {
  width: 800,
  height: 600
}

export default () => {
  const debug = process.env.NODE_ENV !== 'production'

  // See: https://github.com/atom/electron/blob/master/docs/api/crash-reporter.md
  //require('crash-reporter').start();

  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the javascript object is GCed.
  let mainWindow = null;

  app.on('ready', () => {
    mainWindow = new BrowserWindow(WINDOW_OPTS)

    mainWindow.loadUrl(`file://${INDEX_HTML}`);
    mainWindow.show()

    if (debug) mainWindow.openDevTools({detach:true})

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    })
  })

  app.on('window-all-closed', () => {
    //if (process.platform != 'darwin')
      app.quit();
  });
}

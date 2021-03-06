// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')

let sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('./todo.db')

const production = !process.env.ELECTRON_RELOAD;

if (!production) {
	const path = require('path');
	require('electron-reload')(__dirname, {
		electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
		awaitWriteFinish: true,
	});
}

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: "Test App",
    show: false,
    //frame: false,
    width: 800,
    height: 600,
    webPreferences: {
      //preload: path.join(__dirname, 'public/preload.js')
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('public/index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('quit', app.quit)

ipcMain.on('addTodo', (e,todo) => {
  let q = db.prepare("INSERT INTO todos (todo) VALUES (?)")
  q.run(todo)
  q.finalize()
})

ipcMain.on('giveTodos', (e) => {
  db.all("SELECT * FROM todos ORDER BY id DESC", (err, rows) => {
	  e.sender.send('getTodos', rows)
  })
})

ipcMain.on('clearTodos', (e) => {
  db.run("DELETE FROM todos")
  e.sender.send('clearedTodos')
})
const {ipcRenderer} = require('electron');

function startRecording() {
	let time;
	ipcRenderer.on('started-recording', (event, when) => {
		console.log(`Started recording after ${(when - time) / 1000}s`);
	});

	time = Date.now();
	ipcRenderer.send('start-recording');
}

function askUserToSaveFile(opts) {
	if (!opts.filePath || !opts.fileName) {
		throw new Error('askUserToSaveFile must be called with {filePath, fileName}');
	}

	const a = document.createElement('a');
	a.style.display = 'none';
	a.href = opts.filePath;
	a.download = opts.fileName;
	document.body.appendChild(a);
	a.click();
}

function stopRecording() {
	ipcRenderer.on('stopped-recording', (event, filePath) => {
			askUserToSaveFile({
				fileName: `Screen record ${Date()}.mp4`,
				filePath
			});
	});
	ipcRenderer.send('stop-recording');
}

document.querySelector('#start').onclick = startRecording;

document.querySelector('#stop').onclick = stopRecording;

function generateMatriks(firefly, operation){
	m = new Array(firefly);

	for(i=0; i<firefly; i++){
		m[i] = new Array(operation);
		for(j=0; j<operation; j++){
			m[i][j] = { number: Math.random(), firefly: i, order: j+1, "dX":0 };
		}
	}
	
	return m;
}

function diskritTable(matrix, job){
	for(i in matrix){
		matrix[i].sort(function(a, b){ return a.number - b.number });
		for(j in matrix[i]){
			dX = ( matrix[i][j].order % job ) + 1;
			matrix[i][j].dX = dX;
		}
	}
	
	return matrix;
}

function getDNum(matrix, firefly){
	arr = new Array();
	
	for(x in matrix[firefly]){
		arr[x] = matrix[firefly][x].dX;
	}
	
	return arr;
}

function parsingInput(input){
	line = input.split("\n");

	arr = new Array(line.length);
	for(x in line){
		arr[x] = line[x].split(",").map(Number);
	}

	return arr;
}

function printOut(tableName, data){
	table = document.getElementById(tableName);
	
	for(x in data){
		tr = document.createElement("tr");
		nama = document.createElement("td");
		msg = document.createElement("td");

		nama.innerHTML = data[x].nama;
		msg.innerHTML = data[x].msg;
		
		tr.appendChild(nama);
		tr.appendChild(msg);
		table.appendChild(tr);
	}
}

function runGantt(sequence, flow, time, machine, jobTotal){
	var mesin = new Array();
	var jobs = new Array();
	
	for(a=0; a<machine; a++){
		mesin[a] = { sumTime: parseInt(0), jobTime: parseInt(0), job: parseInt(0) };
	}
	
	console.log('Mesin after build :');
	console.log(mesin);
	
	for(b=0; b<jobTotal; b++){
		jobs[b] = { index: parseInt(0), lastMachine: parseInt(0), readyTime: parseInt(0) };
	}
	
	console.log('Jobs after build :');
	console.log(jobs);
	
	console.log(flow);
	
	for(x in sequence){
		// ambil job ke berapa pada sequence
		thisJob = parseInt(sequence[x]);
		console.log('current Job: '+thisJob);
		
		// ambil no mesin yg digunakan pada urutan job flow tersebut job[no job][order]
		thisMachine = parseInt(flow[parseInt(thisJob) - 1][jobs[parseInt(thisJob) - 1].index]);
		console.log('current Machine: '+thisMachine);
		
		console.log('before job '+thisJob+' :');
		console.log(jobs[parseInt(thisJob) - 1]);
		
		// jika nilai mesin tidak kosong ( tidak masuk mesin manapun )
		if(parseInt(thisMachine) != 0){
			cMachine = parseInt(thisMachine) - 1;
			neededTime = time[parseInt(thisJob) - 1][cMachine];
			console.log('Time needed for this job: '+neededTime);
			
			// jika total waktu pada mesin masih 0
			if(mesin[cMachine].sumTime == 0){
				mesin[cMachine].sumTime = neededTime;
				mesin[cMachine].jobTime = neededTime;
				mesin[cMachine].job = thisJob;
				
				jobs[parseInt(thisJob) - 1].index++;
				jobs[parseInt(thisJob) - 1].lastMachine = cMachine;
				jobs[parseInt(thisJob) - 1].readyTime = mesin[cMachine].sumTime;
				
				console.log('gantt nya 0 :');
				console.log(mesin[cMachine]);
			}else{
				sumTime = mesin[cMachine].sumTime;
				ready = jobs[parseInt(thisJob) - 1].readyTime;
				
				if(ready <= sumTime){
					mesin[cMachine].sumTime += neededTime;
					mesin[cMachine].jobTime = neededTime;
					mesin[cMachine].job = thisJob;

					jobs[parseInt(thisJob) - 1].index++;
					jobs[parseInt(thisJob) - 1].lastMachine = cMachine;
					jobs[parseInt(thisJob) - 1].readyTime = mesin[cMachine].sumTime;
				}else{
					spaceTime = sumTime - ready;
					
					mesin[cMachine].sumTime += ( neededTime + spaceTime );
					mesin[cMachine].jobTime = neededTime;
					mesin[cMachine].job = thisJob;

					jobs[parseInt(thisJob) - 1].index++;
					jobs[parseInt(thisJob) - 1].lastMachine = cMachine;
					jobs[parseInt(thisJob) - 1].readyTime = mesin[cMachine].sumTime;
				}
				
				console.log('gantt nya :');
				console.log(mesin[cMachine]);
			}
			
			console.log('after job '+thisJob+' :');
			console.log(jobs[parseInt(thisJob) - 1]);
		}
	}
	
	makespan = 0;
	for(index in mesin){
		if(mesin[index].sumTime > makespan){
			makespan = { gantt:mesin[index], mesin:index };
		}
	}
	
	return makespan;
}
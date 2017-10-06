#include <iomanip>
#include <iostream>
#include <array>
#include <string>
#include <fstream>
#include <sstream>
#include <stdio.h>
#include <vector>
#include <cmath>

using namespace std;

struct discreet {
	float rnum;
	int order;
	int value;
};

struct proses{
	int queue;
	int job;
	int start;
	int end;
	int duration;
};

struct gantt{
	int end;
	vector<proses> queue;
};

struct job{
	int id;
	int mesin;
	int durasi;
	int ready;
	int count;
};

class Firefly {
	int ops;
	vector<discreet> dX;
	
	public:
		void build(int j, int m){ 
			ops = j * m;
			dX.resize(ops);
			
			for(int x = 0; x < ops; x++){
				dX.at(x).rnum = static_cast <float> (rand()) / static_cast <float> (RAND_MAX);
				dX.at(x).order = x + 1;
				dX.at(x).value = abs((x+1)%j) + 1;
			}
		}
		
		void sort(int jobCount){
			for(int z = 0; z < ops; z++){
				discreet current = dX.at(z);
				for(int y = ops - 1; y >= z; y--){
					if(current.rnum > dX.at(y).rnum){
						dX.at(z) = dX.at(y);
						dX.at(y) = current;
						dX.at(z).value = abs(dX.at(z).order % jobCount) + 1;
						current  = dX.at(z);
					}
				}
			}
		}
		
		float rnum(int idx){ return dX.at(idx).rnum; }
		int order(int idx){ return dX.at(idx).order; }
		int value(int idx){ return dX.at(idx).value; }
		int size(){ return ops; }
};

int jobs;
int machine;
int ffly;
vector<int> makespan;
vector<Firefly> ff;
vector<vector<job>> jobset;

void startGantt(Firefly kunang){
	vector<gantt> gantt;
	gantt.resize(machine);
	cout << "gantt vector created .. ";
	
	for(int im=0; im < machine; im++){
		gantt[im].queue.resize(jobs);
		gantt[im].end = 0;
		cout << "gantt machine number " << im << " starting line in " << gantt[im].end << " .. ";
	}
	
	cout << "gantt vector initialized .. ";
	
	int cJob, cMachine, cTime, jc = 0;
	for(int count = 0; count < kunang.size(); count++){
		cJob = kunang.value(count) - 1;
		jc = jobset[cJob][jc].count;
		cMachine = jobset[cJob][jc].mesin - 1;
		cTime = jobset[cJob][jc].durasi;
		
		cout << "current job " << cJob + 1 << " in machine " << cMachine + 1 << " with job duration " << cTime << " .. ";		
		int sumTime = gantt[cMachine].end;
		int ready = jobset[cJob][jc].ready;
		
		cout << "checked ready time " << ready << " and sumTime " << gantt[cMachine].end << " .. ";
		
		gantt[cMachine].queue[jc].start = sumTime;
		if(ready <= sumTime){
			gantt[cMachine].end += cTime;
		}else{
			gantt[cMachine].end = cTime + ready;
		}
		
		cout << "ready time " << gantt[cMachine].end << " .. ";
		
		gantt[cMachine].queue[jc].end = gantt[cMachine].end;
		
		jobset[cJob][jc].ready = gantt[cMachine].end;
		jobset[cJob][jc].count++;
	}
	
	cout << "calc makespan .. ";
	int ms = gantt[0].end;
	for(int q = 0; q < gantt.size(); q++){
		if(ms < gantt[q].end){
			ms = gantt[q].end;
		}
	}
	cout << "makespan calculated " << ms << " .. ";
	makespan.push_back(ms);
	cout << "clearing gantt structure .. ";
	//gantt.clear();
	cout << "all done, returning to main." << endl << endl;
}

void getSetting(string sfile, string tfile){
	string line;
	int numb;
	ifstream fileIn;
	
	fileIn.open(sfile);
	if(fileIn.fail()){
		cerr << "#File tidak bisa dibuka, tolong tutup proses file terlebih dahulu." << endl;
		
		string answr;
		cout << "#Exit ? [Y/N] ";
		cin >> answr;
		exit(1);
	}
	
	int iM = 0;
	int iJ = 0;
	while(fileIn.good()){
		while(getline(fileIn, line)){
			istringstream streamLine(line);
			iM = 0;
			while(streamLine >> numb){
				jobset.at(iJ).at(iM).mesin = numb;
				iM++;
				
				if(iM >= machine){
					break;
				}
			}
			iJ++;
			
			if(iJ >= jobs){
				break;
			}
		}
	}
	
	fileIn.close();
	
	fileIn.open(tfile);
	if(fileIn.fail()){
		cerr << "#File tidak bisa dibuka, tolong tutup proses file terlebih dahulu." << endl;
		
		string answr;
		cout << "#Exit ? [Y/N] ";
		cin >> answr;
		exit(1);
	}
	
	iJ = 0;
	while(fileIn.good()){
		while(getline(fileIn, line)){
			istringstream streamLine(line);
			iM = 0;
			while(streamLine >> numb){
				jobset.at(iJ).at(iM).id = iJ;
				jobset.at(iJ).at(iM).durasi = numb;
				jobset.at(iJ).at(iM).ready = 0;
				jobset.at(iJ).at(iM).count = 0;
				
				iM++;
				if(iM >= machine){
					break;
				}
			}
			iJ++;
			if(iJ >= jobs){
				break;
			}
		}
	}
	
	fileIn.close();
	
	string answr;
	
	// Display data
	cout << "Received Setting :" << endl;
	cout << "Machine Count [" << machine << "]" << endl;
	cout << "Job Count [" << jobs << "]" << endl;
	cout << "-----------------------------------------------------------------" << endl;
	cout << "# Display Builded Setting ? [Y/N] ";
	cin >> answr;
	
	if(answr == "Y"){
		cout << "*keterangan job [ mesin, durasi ]" << endl << endl;
		for(int i = 0; i < jobs; i++){
			cout << "jobset ke-" << i+1 << endl;
			for(int j = 0; j < machine; j++){
				cout << left << setw(3) << "[" << jobset[i][j].mesin << "," << setw(3) << jobset[i][j].durasi << "] ";
			}
			cout << endl << endl;
		}
	}

	cout << "-----------------------------------------------------------------" << endl;
} 

int main(){
	
	string sfile, tfile;
	string answr;
	
	// Intro
	cout << "# Welcome to this program for calculating makespan" << endl;
	cout << "# Copyright by Aisyah Nur Rahma Dedicated for Final Project" << endl;
	cout << "# *Please make sure your data file is csv formated by space" << endl;
	cout << "# *Please make sure your data location is in the same directory" << endl;
	cout << endl;
	
	cout << "# Please input machine count : ";
	cin >> machine;
	
	cout << "# Please input job count : ";
	cin >> jobs;
	
	jobset.resize(jobs);
	for(int x = 0; x < jobs; x++){
		jobset.at(x).resize(machine);
	}
	
	cout << "# Please input your machine jobs matrix data file name : ";
	cin >> sfile;
	
	cout << "# Please input your job time matrix data file name : ";
	cin >> tfile;
	
	cout << endl;
	getSetting(sfile, tfile);
	
	cout << "# Please input firefly count : ";
	cin >> ffly;
	cout << "-----------------------------------------------------------------" << endl;
	
	cout << "Generated firefly : " << endl;
	ff.resize(ffly);
	makespan.resize(ffly);
	for(int k = 0; k < ffly; k++){
		ff[k].build(jobs, machine);
		ff[k].sort(jobs);
		
		cout << endl << "Firefly [" << k << "] : " << endl;
		cout << "Discreet : ";
		for(int l = 0; l < ff[k].size(); l++){
			cout << ff[k].value(l);
			if(l == ff[k].size() - 1){
				cout << endl;
			}else{
				cout << ", ";
			}
		}
		
		cout << "calculating gantt for current firefly" << endl;
		startGantt(ff[k]);
		cout << "returned makespan : " << makespan[k] << endl;
	}
	cout << endl;
	
	cout << "#Exit ? [Y/N] ";
	cin >> answr;
	
	return 0;
}
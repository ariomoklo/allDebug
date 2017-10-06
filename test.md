# Mulai iterasi

- Cari nilai makespan terkecil dari fireflys
- Cari nilai r (jarak antar firefly ke firefly yg terbaik)
   
     r(ff) = sum( pow(FFbest_randSort - FF_randSort(ff), self) )

- Cari nilai Beta (nilai keatraktifan)

     Beta(ff) = 0.02(beta0) * pow(exponen(2,718), -0,0001*r(ff))

- Cari distrik table baru selain firefly yang best

     alpha = 0.05
	alpha = alpha * delta
	newNumbs(ff)(i) = numbs(ff)(i) + Beta(ff)*(numbs(ffbest)(i) - numbs(ff)(i)) + alpha(rand(0,1) - 0.5)
     
	mulai gantt lagi dari pengurutan posisi
	hasilin makespan baru

# ulang iterasi sampai n

nb: rekursif aja (thumb)
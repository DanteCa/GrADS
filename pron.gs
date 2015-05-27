*pronostico
say 'Ya se ha conectado al servidor el GFS/NOAA? (s/n)'
pull resp

if(resp='n')
'reinit'
'sdfopen http://nomads.ncep.noaa.gov:9090/dods/gfs_0p50/gfs20150520/gfs_0p50_06z'
endif

if(resp='s')
'reset'
endif

'set display color white'
'set mpdset hires'
'set mpdset depar'
'c'

say 'Seleccione la opcion del producto que desea'
say '1: Viento y presiones a nivel del mar en el Pacífico'
say '2: Viento y altura geopotencial'
say '3: Vorticidad relativa'
say '4: Adveccion de vorticidad relativa (no recomendable todavia)'
pull opc
say 'Elija el tiempo que desee trabajar (t=1->dato instantaneo)'
pull tempo
say 'Seleccione el nivel de presion a trabajar (1000 para la primera opcion)'
pull elev

*Presion y vientos a nivel del mar
if(opc=1)
'set t 'tempo
'q dims'
line=sublin(result,5)
fecha=subwrd(line,6)
'set grads off'
'set lat -60 15'
'set lon 220 310'
'set lev 1000'
'set gxout shaded'
'color -levs 978 981 984 987 990 993 996 999 1002 1020 1023 1026 1029 1032 1035 1038 1041 -kind blue-(8)->white-(1)->gold->red->darkred'
'd prmslmsl/100'
'cbarn'
'set gxout contour'
*'set cint 4'
'd prmslmsl/100'
'set gxout vector'
'set ccolor 1'
'd ugrdprs;skip(vgrdprs,8,8)'
'draw title 'fecha
'printim mslp_vientos_'tempo'.png png x1200 y900'
endif

*Vientos y altura geopotencial a 200hpa
if(opc=2)
'set t 'tempo
'q dims'
line=sublin(result,5)
fecha=subwrd(line,6)
'set grads off'
'set lat -60 15'
'set lon 220 310'
'set lev 'elev
'set gxout shaded'
*'color -levs 11000 11150 11300 11450 11600 11750 11900 12050 12200 -kind blue->white'
'color -levs 11000 11150 11300 11450 11600 11750 11900 12050 12200 12350 12500 12650 12800 12950 -kind blue-(7)->white->khaki->orange->red'
'd hgtprs'
'cbarn'
'set gxout contour'
*'set cint 4'
'd hgtprs'
'set gxout vector'
'set ccolor 1'
'd ugrdprs;skip(vgrdprs,8,8)'
'draw title 'fecha
'printim altgeo_vientos_'elev'_'tempo'.png png x1200 y900'
endif

*Vorticidad relativa a 200hpa
if(opc=3)
'set t 'tempo
'q dims'
line=sublin(result,5)
fecha=subwrd(line,6)
'set grads off'
'set lat -60 15'
'set lon 220 310'
'set lev 'elev
'set gxout shaded'
'color -20 20 4'
'd hcurl(ugrdprs,vgrdprs)*pow(10,5)' 
'cbarn'
'set gxout vector'
'set ccolor 1'
'd ugrdprs;skip(vgrdprs,8,8)'
'draw title (e+05) 'fecha
'printim vortrel_'elev'_'tempo'.png png x1200 y900'
endif

*Adveccion de vorticidad relativa a 200hpa
if(opc=4)
'set t 'tempo
'q dims'
line=sublin(result,5)
fecha=subwrd(line,6)
'set grads off'
'set lat -60 15'
'set lon 220 310'
'set lev 'elev
'define d2r = 3.1415/180'
'define tcos = cos(lat*d2r)'
'define rearth = 6.37e6'
'define vort = hcurl(ugrdprs,vgrdprs)'
'define dvy = cdiff(vort,y)'
'define dvx = cdiff(vort,x)'
'define dy = cdiff(lat,y)*d2r*rearth'
'define dx = cdiff(lon,x)*d2r*rearth*tcos'
'define vadv = -1*ugrdprs*(dvx/dx)-1*vgrdprs*(dvy/dy)'
'set gxout shaded'
*'color -20 20 4'
'd vadv' 
'cbarn'
'draw title 'fecha
'printim vr_200_'tempo'.png png x1200 y900'
endif

*fin
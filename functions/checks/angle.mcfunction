# Blocks invalid viewing angles

tag @a[tag=noBadAngle] remove noBadAngle

tag @a[rxm=-90,rx=90,rym=-180,ry=180] add noBadAngle

execute @a[tag=!noBadAngle,tag=!trident] ~~~ function checks/alerts/anglenotif

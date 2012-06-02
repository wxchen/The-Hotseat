function ColourUtils()
{
}

ColourUtils.HSVToRGB = function(hue, sat, val)
{
    var red, grn, blu, i, f, p, q, t;
    hue%=360;
    if(val==0) {return({r:0, g:0, v:0});}
    sat/=100;
    val/=100;
    hue/=60;
    i = Math.floor(hue);
    f = hue-i;
    p = val*(1-sat);
    q = val*(1-(sat*f));
    t = val*(1-(sat*(1-f)));
    if (i==0) {red=val; grn=t; blu=p;}
    else if (i==1) {red=q; grn=val; blu=p;}
    else if (i==2) {red=p; grn=val; blu=t;}
    else if (i==3) {red=p; grn=q; blu=val;}
    else if (i==4) {red=t; grn=p; blu=val;}
    else if (i==5) {red=val; grn=p; blu=q;}
    red = Math.floor(red*255);
    grn = Math.floor(grn*255);
    blu = Math.floor(blu*255);
    return ({r:red, g:grn, b:blu});
}

ColourUtils.RGBToHex = function(r, g, b)
{
    return '#' + MathUtils.ToHex(r) + MathUtils.ToHex(g) + MathUtils.ToHex(b);
}
# We Might As Well Chat About The Images Portion Of This Codebase
#### _since Git won't just let me [upload an empty images directory](https://git.wiki.kernel.org/index.php/Git_FAQ#Can_I_add_empty_directories.3F)_

***

We currently perform the following optimization passes over the contents of the image directory:

1. [Gifsicle](https://www.lcdf.org/gifsicle/), over GIFs
2. [libjpeg-turbo](https://libjpeg-turbo.org/), over JPEGs
3. [PNGQuant](https://pngquant.org/), over PNGs

Use of [SVGO](https://github.com/svg/svgo) is strongly recommended if you are working with SVGs, but—in my experience—if you are animating or scaling them, and unless you have a truly onerous number of them, you should take the time to hand-tune each one in [SVGOMG](https://jakearchibald.github.io/svgomg/) and perform your own first pass with your own eyes, rather than set up an automatic optimization pipeline.

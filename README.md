# FiberStars - Visual Comparison of Diffusion Tractography Data between Multiple Subjects

## Install & run FiberStars

Clone this repository:

```
git clone https://github.com/lorifranke/FiberStars.git
```

To use the tool with your own data, put your data (.csv for meta data and the files for the fiber cluters as .vtp or .tko) in the folder public/data.
You can convert your data as well to the 28x compressed .tko format with this tool: https://github.com/bostongfx/TRAKO and display it with FiberStars.

Install npm: 

```
npm install    # first time only
npm start
```

## Deploy

1. Add `"homepage": "https://lorifranke.github.io/FiberStars/"` to `package.json`
2. `npm run deploy`


## Cite us:
```
@inproceedings{franke2021fiberstars,
  title={FiberStars: Visual Comparison of Diffusion Tractography Data between Multiple Subjects},
  author={Franke, Loraine and Weidele, Daniel Karl I and Zhang, Fan and Cetin-Karayumak, Suheyla and Pieper, Steve and O’Donnell, Lauren J and Rathi, Yogesh and Haehn, Daniel},
  booktitle={2021 IEEE 14th Pacific Visualization Symposium (PacificVis)},
  pages={116--125},
  year={2021},
  organization={IEEE}
}
```

# FiberStars - Visual Comparison of Diffusion Tractography Data between Multiple Subjects

## Install & Run FiberStars:

### Clone this repository:

```
git clone https://github.com/lorifranke/FiberStars.git
```

### Use your own data:

To use the tool with your own data, navigate to the cloned repository on your local computer. Then, put your own data (this includes a .csv file containing the meta data and the files for the fiber cluters as .vtp or .tko) in the folder public/data.

Optionally, you can convert your data as well to the 28x compressed .tko format with this tool: https://github.com/bostongfx/TRAKO to display it with FiberStars.

### Install npm: 

```
npm install    # first time only
npm start
```

### Deploy

1. Add `"homepage": "https://lorifranke.github.io/FiberStars/"` to `package.json`
where the url should point to your own github repository page where you want to deploy the tool.
2. `npm run deploy`

## Demos ##
![splitscreenview](https://user-images.githubusercontent.com/38534852/204695249-f3ce48ce-9151-4e6d-962c-aab9efca48f4.jpeg)


## Affiliations, Collaborators and Sponsors ##
<a href="https://www.brighamandwomens.org/"><img src="https://www.brighamandwomens.org/assets/BWH/core/sprites/vectors/bwh-logo.svg" alt="Brigham and Womens Hospital" width="200"></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<a href="http://hms.harvard.edu"><img src="http://xtk.github.io/hms_logo.png" alt="Harvard Medical School" title="Harvard Medical School" width="200"></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<a href="https://www.umb.edu"><img src="https://www.umb.edu/assets/images/UMASSB0STON_ID_blue.png?1560890493" width="80" ></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<a href="https://isomics.com/"><img src="https://isomics.com/isomics-logo-text-horizontal-700.png" alt="Isomics" title="Isomics" width="150"></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<a href="https://research.ibm.com/"><img src="https://avatars.githubusercontent.com/u/22341564?s=280&v=4" width="100"></a>

## License ##
Copyright (c) 2022 The Fiberstars Developers. Fiberstars is licensed under the MIT License: <a href="http://www.opensource.org/licenses/mit-license.php" target="_blank">http://www.opensource.org/licenses/mit-license.php</a>
  
## Publications ##
### Cite us: ###
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



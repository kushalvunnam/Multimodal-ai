const fs = require('fs');
let dash = fs.readFileSync('frontend/src/pages/Dashboard.jsx', 'utf8');

dash = dash.replace("import { Canvas, useFrame } from '@react-three/fiber';", "");
dash = dash.replace("import { Sphere, Torus, Float, Environment } from '@react-three/drei';", "");
dash = dash.replace("import * as THREE from 'three';", "");

fs.writeFileSync('frontend/src/pages/Dashboard.jsx', dash);

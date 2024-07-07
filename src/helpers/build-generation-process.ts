import fs from "fs";
import { getAllBuilds } from "./build-generator";
import medallions from "../stores/medallion.store";



export default () => {
    console.log('Start generations  of new builds..');

    const builds = getAllBuilds();
    const buildsMedallions = builds.map(build => {
        const medallionsIds = build.medallions.map(medallion => medallion.id);
        return medallionsIds; 
    });
    const buildsMedallionsString = JSON.stringify(buildsMedallions);
    // create hash of this string and compare with current hash to check if builds are changed to recalculate them?

    const textEncoder = new TextEncoder();
    console.log('Build hashes size:',textEncoder.encode(buildsMedallionsString).length);

    // Combine all chunks into a single Blob
    const blob = new Blob([buildsMedallionsString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "builds-medallions.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);


    console.log('Builds file complete');
}
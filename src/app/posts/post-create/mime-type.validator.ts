// task of:
//      getting the value of control (formControl) - a file
//      read that using fileReader
//      checking the mime-type of file

import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

// ALL VALIDATORS ARE JUST FUNCTIONS WITH ARGUMENT OF FORMCONTROL
// the control is the argument of type Abstract

// this is asynchronous task - we have to define a 'SPECIAL' return type !!!
// a normal syncrhorous validator would return a javascript object with key value pair ( null - valid, error - not valid)
// here that error code is wraped with an Obsevable or Promise

// Promise<{[key: string]: any}> - This will have a property as a string BUT WE DO NOT CARE ABOUT THE NAME=(key:...) - to je takva notacija
export const mimeType = (
  control: AbstractControl    // uzima kontrol - objekat argument
  ): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  if (typeof(control.value) === 'string') {
    return of(null)
  }
  const file = control.value as File;

  const fileReader = new FileReader();
  // rxjs gives us an option to create an observable of an SYNCHRONOUS FUNCTION !!!!
  // we use  (observer: Observer) as a tool to control when this Observable emits new data
  const frObs = Observable.create((observer: Observer<{ [key: string]: any }>) => {
    fileReader.addEventListener("loadend", () => {
      //console.log("whole file",new Uint8Array(fileReader.result as ArrayBuffer) )
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);    // a way to allow us to access and read patterns in the file and file metadata that we can use to parse MIME-TYPE
      let header = "";
      let isValid = false;
      let header1 = "";
      const arr1 = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 10);
      for (let i = 0; i < arr1.length; i++) {
        header1 += arr1[i].toString(16) // - convert this to hexadecimal string
      };
      console.log("header1", header1);
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16) // - convert this to hexadecimal string
      };
      switch(header) {
        case '89504e47':
          isValid = true;
          break;
        case 'ffd8ffe0':
        case 'ffd8ffe1':
        case 'ffd8ffe2':
        case 'ffd8ffe3':
        case 'ffd8ffe8':
          isValid = true;
          break;
        default:
          isValid = false;  // Or you can use the blob.type as fallback
          break;
      }
      if (isValid) {
        observer.next(null) // ako je sve OK
      } else {
        observer.next({ invalidMimeType: true })
      }
      observer.complete();
    });
    fileReader.readAsArrayBuffer(file)
  });
  return frObs;
}

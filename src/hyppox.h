/**************************************************************************************************
 Copyright © 2016-2018 Md.Kamruzzaman. All rights reserved.
 The generated code is released under following licenses:
 GNU GENERAL PUBLIC LICENSE, Version 3, 29 June 2007
 --------------------------------------------------------------------------------------------------
 File name: hyppoxlib.h
 Objective: Entry class
 Additional information: NA
 --------------------------------------------------------------------------------------------------
 Contributors                   Date            Task details
 -------------------------    ----------      --------------------
 Md. Kamruzzaman              11/20/2018      Initial version
 Md. Kamruzzaman              10/02/2019      Creating an interface to call from html
 **************************************************************************************************/

#ifndef HYPPOX_H
#define HYPPOX_H

#include <math.h>
#include <string>
#include <fstream>

#include "hyppox/hyppox.h"

namespace file_handler{
  class File_Handler{
  public:
    File_Handler() = default;
    ~File_Handler() = default;

    void setFile(std::string filePath){this->fileNameWithPath = filePath;}

    std::string getFileHeader(){
      std::string line="";

      try {
          std::ifstream fileReader(this->fileNameWithPath);

          if(fileReader.is_open()){
            getline(fileReader, line);
          }else{
              line = "Error to read file. Please check the file name and path.";
          }

      } catch (std::exception &e) {
          line = "Error to read file: " + std::string(e.what());
      }

      return line;
    }

  private:
    std::string fileNameWithPath;
  };
}

namespace hyppox_interface{
  class Hyppox_Interface{
  public:
    Hyppox_Interface()=default;
    ~Hyppox_Interface()=default;

    std::string callHyppoX(int argc, const char * argv[]){
      hyppox::HInterface* _hyppox = new hyppox::Hyppox();
      if(_hyppox==nullptr){
          std::cout<<"There has no enough memory"<<std::endl;
      }
      std::string _p = _hyppox->getD3GraphObject(argc, argv);
      delete _hyppox;

      return _p;
    }

    std::string getSrt(int num){
      if(num==0) return "0";
      else if(num<0){
        return "i"+ std::to_string(sqrt(-1*num));
      }

      return std::to_string(sqrt(num));
    }

    std::string getFileHeader(std::string fileNameWithPath){
      this->fh.setFile(fileNameWithPath);

      return this->fh.getFileHeader();
    }

  private:
    file_handler::File_Handler fh;
  };
}

#endif /* hyppox.h */

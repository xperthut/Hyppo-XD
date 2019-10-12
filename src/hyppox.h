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
#include <vector>
#include <unordered_set>

#include "hyppox/hyppox.h"

namespace file_handler{
  class File_Handler{
  public:
    File_Handler():fileNameWithPath(""),hasIndexColumn(false){}
    ~File_Handler() = default;

    void setFile(std::string filePath){this->fileNameWithPath = filePath;}

    std::string getFileHeader(){
      std::string header="", line="";
      std::vector<std::string> rows;
      this->hasIndexColumn = this->isFirstColumnAnIndexColumn();

      try {
          std::ifstream fileReader(this->fileNameWithPath);

          if(fileReader.is_open()){
            getline(fileReader, header);

            short rCnt = 0;
            while(getline(fileReader, line)){
              if(rCnt == 500) break;

              rows.push_back(line);
            }

            fileReader.close();
          }else{
              line = "[\"Error to read file. Please check the file name and path.\"]";
          }

      } catch (std::exception &e) {
          line = "[\"Error to read file: " + std::string(e.what()) + "\"]";
      }

      if(header.length()>0 && rows.size()>0){
        line = this->getHeaderOfNumericColumns(header, rows);
      }

      return line;
    }

  private:
    std::string fileNameWithPath;
    bool hasIndexColumn;

    void getData(std::string lineData, std::vector<std::string>& line){
      bool start = false;
      std::string s="";
      line.clear();

      for(char ch:lineData){
        if(ch=='\n'||ch=='\r'){
            break;
        }else if(ch=='"'){
            if(start) start=false;
            else start = true;
        }else if(ch==','){
            if(start) s+= ch;
            else{
              line.push_back((this->isValidNumber(s))?s:"\"" + s + "\"");
              s="";
            }
        }else{
            s += ch;
        }
      }
    }

    void getRowData(std::string lineData, std::vector<bool>& line){
      bool start = false;
      std::string s="";
      short col = -1;

      for(char ch:lineData){
        if(ch=='\n'||ch=='\r'){
            break;
        }else if(ch=='"'){
            if(start) start=false;
            else start = true;
        }else if(ch==','){
            if(start) s+= ch;
            else{
              col++;
              if(line[col]) line[col]= (this->isValidNumber(s))?true:false;
              s="";
            }
        }else{
            s += ch;
        }
      }
    }

    bool isValidNumber(std::string s){
      try{
          size_t i=0;
          std::stod(s, &i);
          //std::cout<<s.length()<<", "<<i<<std::endl;
          if(i==s.length()) return true;
          else return false;
      }catch (const std::invalid_argument& e) {
          //std::cout<<"invalid_argument: "<<e.what()<<std::endl;
          return false;
      }catch (std::exception &e) {
          //std::cout<<"Other: "<<e.what()<<std::endl;
          return false;
      }
    }

    bool isFirstColumnAnIndexColumn(){
      bool start = false;
      std::string line="", s="";
      try {
          std::ifstream fileReader(this->fileNameWithPath);

          if(fileReader.is_open()){
            getline(fileReader, line);

            std::unordered_set<size_t> fSet;
            while(getline(fileReader, line)){
              for(char ch:line){
                if(ch=='\n'||ch=='\r'){
                    break;
                }else if(ch=='"'){
                    if(start) start=false;
                    else start = true;
                }else if(ch==','){
                    if(start) s+= ch;
                    else{
                      if(!this->isValidNumber(s)) return false;

                      std::stringstream sstream(s);
                      size_t index;
                      sstream >> index;

                      if(fSet.find(index)!=fSet.end()) return false;
                      fSet.insert(index);

                      s="";

                      break;
                    }
                }else{
                    s += ch;
                }
              }
            }

            fileReader.close();
          }else{
              line = "[\"Error to read file. Please check the file name and path.\"]";
          }

      } catch (std::exception &e) {
          line = "[\"Error to read file: " + std::string(e.what()) + "\"]";
      }

      return true;
    }

    std::string getHeaderOfNumericColumns(const std::string& header, const std::vector<std::string>& firstRow){
      std::vector<std::string> vHeader, vFirstRow;
      std::string line = "{\"index\":";

      //std::cout<<header<<std::endl;
      //std::cout<<firstRow<<std::endl;

      this->getData(header, vHeader);
      std::vector<bool> numericHeader(vHeader.size(), true);

      for(size_t i=0; i<firstRow.size(); i++){
        this->getRowData(firstRow[i], numericHeader);
      }

      line += (this->hasIndexColumn)?"true":"false";
      line += ", \"header\":[";

      bool f=true;
      for(size_t i=0; i<vHeader.size(); i++){
        //std::cout<<vHeader[i]<<std::endl;
        if(numericHeader[i]){
          //std::cout<<"valid"<<std::endl;
          if(f) f = false;
          else if(line.length()>1) line += ", ";
          line += "\"" + std::to_string(i+1) + "\"" + "," + vHeader[i];
        }
        //std::cout<<vFirstRow[i]<<std::endl;
      }

      line += "]}";

      //std::cout<<line<<std::endl;

      return line;
    }

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

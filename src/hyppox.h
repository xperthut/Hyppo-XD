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

#include "hyppox/hyppox.h"

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
  };
}

#endif /* hyppox.h */

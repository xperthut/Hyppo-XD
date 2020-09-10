
/**************************************************************************************************
 Copyright © 2016-2018 Md.Kamruzzaman. All rights reserved.
 The generated code is released under following licenses:
 GNU GENERAL PUBLIC LICENSE, Version 3, 29 June 2007
 --------------------------------------------------------------------------------------------------
 File name: simplicialComplex.h
 Objective: Class to create simplicial complex
 Additional information: NA
 --------------------------------------------------------------------------------------------------
 Contributors                   Date            Task details
 -------------------------    ----------      --------------------
 Md. Kamruzzaman              08/17/2016      Initial version
 Md. Kamruzzaman              04/11/2017      Implement bit logic to create simplex

 **************************************************************************************************/

#ifndef simplicialComplex_h
#define simplicialComplex_h

/*
include "external/Gudhi/graph_simplicial_complex.h"
include "external/Gudhi/Simplex_tree.h"
include "external/Gudhi/Persistent_cohomology.h"
 */

#include <iostream>
#include <ctime>
#include <utility>
#include <fstream>

#include <unordered_map>
#include <map>
#include <set>
#include <unordered_set>
#include <list>
#include <string>
#include <bitset>
#include <vector>
#include "performance.h"

/*
using Simplex_tree = Gudhi::Simplex_tree<>;
using Filtration_value = Simplex_tree::Filtration_value;
using Field_Zp = Gudhi::persistent_cohomology::Field_Zp;
using Persistent_cohomology = Gudhi::persistent_cohomology::Persistent_cohomology<Simplex_tree, Field_Zp >;
using typeVectorVertex = std::vector<Simplex_tree::Vertex_handle>;
*/

namespace hyppox{
    namespace mapper{
        template<typename SLType>
        class SimplexList{
            public:
            std::list<std::string> slist;
            std::list<std::vector<SLType> > sv;

            SimplexList(std::string s){slist.push_back(s);}
            SimplexList(std::vector<SLType> v){sv.push_back(v);}
            ~SimplexList() = default;

            std::string GetAllData(std::string delim="\t\t"){
                std::string str = "";

                for(auto sitr = slist.begin(); sitr != slist.end(); sitr++){
                    if(str.length() > 0) str += "\n";

                    str += delim + *sitr;
                }

                return str;
            }
        };

        template<typename PerfType, typename ClusterIDType>
        class SimplicialComplex{
            public:
            //using SCType = SimplicialComplex<PerfType,ClusterIDType>;
            SimplicialComplex()=default;
            ~SimplicialComplex()=default;

            void AddSimplicialComplex(PerfType* ph, float &filtration);
            void clearTracker();
            std::string PrintSimplex();
            //std::vector<float> getPersistentOverlap();

            private:
            std::unordered_map<ClusterIDType, float> zeroSimplex;
            std::unordered_map<std::string, float> oneOrMoreSimplex;
            std::map<float, SimplexList<long>*> simplexMap;
            std::unordered_set<std::string> sNodes;

            std::unordered_set<size_t> indvTracker;
            std::unordered_set<size_t> edgeTracker;
            std::unordered_set<std::string> keyTracker;
            std::unordered_map<std::string, float> simplexFiltrationMap;

            void AddToOneOrMoreSimplex(std::string nodeList, float filtrationValue);
            void AddToSimplexMap(std::string key, float &filteration);
            void CreateSimplex(std::set<ClusterIDType>* idList, float &filtration);
            void CreateSimplexForGudhi(std::set<ClusterIDType>* idList, float &filtration);
        };

        template<typename PerfType, typename ClusterIDType>
        void SimplicialComplex<PerfType,ClusterIDType>::AddSimplicialComplex(PerfType *ph, float &filtration){
            if(ph!=nullptr){
                size_t indv = ph->getID();

                // New individual
                if(indvTracker.find(indv)==indvTracker.end()){
                    std::vector<ClusterIDType> idList(Config::TOTAL_CLUSTER_IDS, 0);
                    ph->GetIDList(idList);
                    std::set<ClusterIDType> ids;
                    //list<long> lid;

                    for(short i=0; i<Config::TOTAL_CLUSTER_IDS; i++){
                        if(idList[i]>0){
                            ids.insert(idList[i]);
                        }
                    }

                    if(Config::PH_JAVA_PLEX){
                        this->CreateSimplex(&ids, filtration);
                    }/*else{
                        this->CreateSimplexForGudhi(&ids, filtration);
                    }*/
                }
            }
        }

        template<typename PerfType, typename ClusterIDType>
        void SimplicialComplex<PerfType,ClusterIDType>::clearTracker(){indvTracker.clear();}

        template<typename PerfType, typename ClusterIDType>
        std::string SimplicialComplex<PerfType,ClusterIDType>::PrintSimplex(){
          std::string simplexSTR = "/**************************************************************************************************\nCopyright © 2016-2018 Md.Kamruzzaman. All rights reserved.\nThe generated code is released under following licenses:\nGNU GENERAL PUBLIC LICENSE, Version 3, 29 June 2007\n\n--------------------------------------------------------------------------------------------------\nFile name: Barcode.java\nObjective: Generate barcode image\nAdditional information: NA\n\n--------------------------------------------------------------------------------------------------\nContributors                   Date            Task details\n-------------------------    ----------      --------------------\nMd. Kamruzzaman              02/16/2017      Initial version\n**************************************************************************************************/\n\n// Run from terminal\n//javac -cp .:javaplex-4.3.4.jar Barcode.java -d . && java -cp .:javaplex-4.3.4.jar barcode.Barcode\n\npackage barcode;\n\nimport edu.stanford.math.plex4.homology.barcodes.BarcodeCollection;\nimport edu.stanford.math.plex4.homology.chain_basis.Simplex;\nimport edu.stanford.math.plex4.homology.interfaces.AbstractPersistenceAlgorithm;\nimport edu.stanford.math.plex4.streams.impl.ExplicitSimplexStream;\nimport java.io.IOException;\nimport java.util.logging.Level;\nimport java.util.logging.Logger;\n\npublic class Barcode{\n\tpublic void GetStreamForData(ExplicitSimplexStream stream) {\n\t\t/************ Start from here *************/\n";

          std::string simplex = "";
          std::string fName = "", tmpFN="";
          const std::string fCascad = "-";

          // Filternames
          tmpFN="";
          for(int i=0; i<hyppox::Config::FILTER; i++){
              if(tmpFN.length()>0) tmpFN += fCascad;
              tmpFN += hyppox::Config::FILTER_NAMES[i];
          }
          fName = tmpFN;

          // Filternames_windows
          tmpFN="";
          for(int i=0;i<hyppox::Config::FILTER;i++){
              if(tmpFN.length()>0) tmpFN += fCascad;
              tmpFN += std::to_string(hyppox::Config::WINDOWS[i]);
          }
          if(tmpFN.length()>0) fName += "_" + tmpFN;

          // Filternames_windows_clusterParams
          if(hyppox::Config::CLUSTER_METHOD.compare("DBSCAN")==0){
              fName += "_" + fixPrecision(hyppox::Config::CLUSTER_PARAM[0], 4)+
                  fCascad + fixPrecision(hyppox::Config::CLUSTER_PARAM[1], 0);
          }

          for(auto sitr = this->simplexMap.begin(); sitr != this->simplexMap.end(); sitr++){
              if(simplex.length()>0) simplex += "\n";

              simplex += sitr->second->GetAllData();
          }

          simplex += "\n";

          simplexSTR += simplex + "\n\t\t/************ End here *************/\n\t}\n\n"+
              "\tpublic static void main(String[] args) {\n"+
                      "\t\tBarcode barcode_ = new Barcode();\n" +
                      "\t\tint dimension = 4; // The maximum dimension\n\n" +
                      "\t\tExplicitSimplexStream stream = edu.stanford.math.plex4.api.Plex4.createExplicitSimplexStream();\n\n" +
                      "\t\tbarcode_.GetStreamForData(stream);\n" +
                      "\t\tstream.finalizeStream();\n\n" +
                      "\t\tint slices = stream.getSize();\n" +
                      "\t\tSystem.out.println(\"Total simplices=\" + slices);\n\n" +
                      "\t\tAbstractPersistenceAlgorithm<Simplex> persistent = edu.stanford.math.plex4.api.Plex4.getDefaultSimplicialAlgorithm(dimension);\n" +
                      "\t\tBarcodeCollection<Double> intervals_index = persistent.computeIntervals(stream);\n\n" +
                      "\t\ttry {\n" +
                          "\t\t\tedu.stanford.math.plex4.api.Plex4.createBarcodePlot(intervals_index, \"Barcode-" + hyppox::Config::DATA_FILE_NAME.substr(0, hyppox::Config::DATA_FILE_NAME.length()-4) + "(" + fName + ")\", 50);\n" +
          "\t\t} catch (IOException ex) {\n" + "\t\t\tLogger.getLogger(Barcode.class.getName()).log(Level.SEVERE, null, ex);\n\t\t}\n\t}\n}";


          return simplexSTR;
        }

    /*
        template<typename PerfType, typename ClusterIDType>
        std::vector<float> SimplicialComplex<PerfType,ClusterIDType>::getPersistentOverlap(){
            Simplex_tree st;

            for(auto itr=this->simplexMap.begin(); itr!=this->simplexMap.end(); itr++){
                for(auto lItr=itr->second->sv.begin(); lItr!=itr->second->sv.end(); lItr++){
                    typeVectorVertex SimplexVector = *lItr;
                    st.insert_simplex_and_subfaces(SimplexVector, itr->first);
                }
            }

            st.set_dimension(Config::FILTER+1);

            ////////////////////
             cout << "\nThe complex contains " << st.num_simplices() << " simplices - " << st.num_vertices() << " vertices "
             << endl;
             cout << "   - dimension " << st.dimension() << endl;
             std::cout << std::endl << std::endl << "Iterator on Simplices in the filtration, with [filtration value]:"
             << std::endl;
             std::cout << "**************************************************************" << std::endl;
             std::cout << "strict graph G { " << std::endl;

             for (auto f_simplex : st.filtration_simplex_range()) {
             std::cout << "   " << "[" << st.filtration(f_simplex) << "] ";
             for (auto vertex : st.simplex_vertex_range(f_simplex)) {
             std::cout << static_cast<int>(vertex) << " -- ";
             }
             std::cout << ";" << std::endl;
             }

             std::cout << "}" << std::endl;
             std::cout << "**************************************************************" << std::endl<<"Press any key to continue...";
             ////////////////////////////

            // Compute the persistence diagram of the complex
            Persistent_cohomology pcoh(st);
            // initializes the coefficient field for homology
            pcoh.init_coefficients(COEFF_FIELD_CHARACTERISTICS);

            pcoh.compute_persistent_cohomology(MIN_PERSISTENCE);

            // Output the diagram in filediag
            //pcoh.output_diagram();

            return pcoh.getPersistentFiltrationValue(Config::FILTER+1);
        }

*/
        /////////////// Private Methods ////////////////////

        template<typename PerfType, typename ClusterIDType>
        void SimplicialComplex<PerfType,ClusterIDType>::CreateSimplexForGudhi(std::set<ClusterIDType> *idList, float &filtration){
            if(idList->size()>0){
                // Sort in ascending order
                //idList->sort();

                std::vector<long> v;
                v.insert(v.begin(), idList->begin(), idList->end());

                std::string s="{";
                for(auto itr=idList->begin(); itr!=idList->end(); itr++){
                    if(s.length()>1) s+=",";
                    s += std::to_string(*itr);
                }
                s +="}";

                if(sNodes.find(s)==sNodes.end()){
                    sNodes.insert(s);

                    auto itr=simplexMap.find(filtration);

                    if(itr==simplexMap.end()){
                        SimplexList<long> *sl = new SimplexList<long>(v);

                        simplexMap.insert(std::make_pair(filtration, sl));
                    }else{
                        itr->second->sv.push_back(v);
                    }
                }
            }
        }

        template<typename PerfType, typename ClusterIDType>
        void SimplicialComplex<PerfType,ClusterIDType>::CreateSimplex(std::set<ClusterIDType> *idList, float &filtration){
            ClusterIDType k = idList->size();

            if(k>0){
                // Sort in ascending order
                //idList->sort();

                std::bitset<BIT_SET_SIZE> idBitSet;
                ClusterIDType _max = pow(2, k)-1;

                for(ClusterIDType i=1; i<=_max; i++){
                    idBitSet = i;


                    // If has at least one 1
                    if(idBitSet.count()>0){

                        // Made key with all 1 position ids
                        std::string key = "";
                        for(ClusterIDType j=0;j<k; j++){

                            // Go to the bit position, similar to the id position in the list
                            if(idBitSet[j]==1){

                                ClusterIDType tmp=0;
                                for(auto itr=idList->begin(); itr!=idList->end(); itr++){

                                    // Match the position of list to the bit set
                                    if(j == tmp){
                                        if(key.length()>0) key += ",";
                                        key += std::to_string(*itr);

                                        break;
                                    }

                                    tmp++;
                                }
                            }
                        }

                        auto sItr=simplexFiltrationMap.find(key);
                        if(sItr == simplexFiltrationMap.end()){
                            if(key.find(",")==std::string::npos){
                                if(filtration==0){
                                   // simplexFiltrationMap.
                                    // Fix output issue here and update
                                    size_t tkey = stoul(key);
                                    if(edgeTracker.count(tkey)>0){
                                        simplexFiltrationMap.insert(std::make_pair(key, filtration));
                                        AddToSimplexMap(key, filtration);
                                    }
                                }
                            }else{
                                std::string tkey(key);
                                size_t pos = tkey.find(",");

                                while(pos!=std::string::npos){
                                    size_t _tp = stoul(tkey.substr(0, tkey.length()-pos));

                                    /*if(_tp==6){
                                        std::cout<<"";
                                    }*/

                                    edgeTracker.insert(_tp);
                                    tkey = tkey.substr(pos+1, tkey.length()-pos-1);
                                    pos = tkey.find(",");
                                }

                                if(tkey.length()>0){
                                    /*if(stoul(tkey)==6){
                                        std::cout<<"";
                                    }*/
                                    edgeTracker.insert(stoul(tkey));
                                }

                                simplexFiltrationMap.insert(std::make_pair(key, filtration));
                                AddToSimplexMap(key, filtration);
                            }

                        }else{
                            if(sItr->second == 0.00 && filtration > 0 && key.find(",")!=std::string::npos){
                                sItr->second = filtration;
                                AddToSimplexMap(key, filtration);
                            }
                        }
                    }
                }
            }
        }

        template<typename PerfType, typename ClusterIDType>
        void SimplicialComplex<PerfType,ClusterIDType>::AddToSimplexMap(std::string key, float &filtration){
            std::string simplexText = "";

            if(key.find(",")==std::string::npos){
                if(filtration==0)
                simplexText = "stream.addVertex(" + key + ", " + std::to_string(filtration).substr(0,5) + ");";
            }else{
                simplexText = "stream.addElement(new int[]{" + key + "},  " + std::to_string(filtration).substr(0,5) + ");";
            }

            if(simplexText.length()>0 && keyTracker.find(simplexText) == keyTracker.end()){
                keyTracker.insert(simplexText);

                auto sitr=this->simplexMap.find(filtration);
                if(sitr == this->simplexMap.end()){
                    SimplexList<long> *sl = new SimplexList<long>(simplexText);

                    this->simplexMap.insert(std::make_pair(filtration, sl));
                }else{
                    sitr->second->slist.push_back(simplexText);
                }
            }
        }
    }
}


#endif /* SimplicialComplex_h */

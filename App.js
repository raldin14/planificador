/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Pressable,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './src/components/Header';
import NuevoPresupuesto from './src/components/NuevoPresupuesto';
import ControlPresupuesto from './src/components/ControlPresupuesto';
import FormularioGasto from './src/components/FormularioGasto';
import {generarId} from './src/helpers';
import ListadoGastos from './src/components/ListadoGastos';
import Filtro from './src/components/Filtro';
import { set } from 'react-native-reanimated';

const App = () => {
  const [isValidPresupuesto, setIsValidPresupuesto] = useState(false);
  const [presupuesto, setPresupuesto] = useState(0);
  const [gastos, setGastos] = useState([]);
  const [modal, setModal] = useState(false);
  const [gasto, setGasto] = useState({});
  const [filtro, setFiltro] = useState('');
  const [gastoFiltrado, setGastoFiltrado] = useState([]);

  useEffect(() => {
    const obtenerPresupuestoStorage = async () => {
      try {
        const presupuestoStorage = await AsyncStorage.getItem('planificador_presupuesto') ?? 0;

        if(presupuestoStorage > 0){
          setPresupuesto(presupuestoStorage);
          setIsValidPresupuesto(true);
        }
      } catch (error) {
        console.log(error);
      }
    }

    obtenerPresupuestoStorage();
  },[]);

  useEffect(() => {
    if(isValidPresupuesto){
      const guardarPrespuesto = async () => {
        try {
          await AsyncStorage.setItem('planificador_presupuesto', presupuesto);
        } catch (error) {
          console.log(error);
        }
      }

      guardarPrespuesto();
    }
  }, [isValidPresupuesto]);

  useEffect(() => {
    const obtenerGastosStorage = async () => {
      try {
        const gastosStorage = await AsyncStorage.getItem('planificador_gastos') ?? [];
        setGastos(gastosStorage ? JSON.parse(gastosStorage) : []);

      } catch (error) {
        console.log(error);
      }
    }

    obtenerGastosStorage();
  }, [])

  useEffect(() => {
    const guardarGastoStorage = async () => {
      try {
        await AsyncStorage.setItem('planificador_gastos', JSON.stringify(gastos));
      } catch (error) {
        console.log(error);
      }
    }

    guardarGastoStorage();
  }, [gastos]);

  const handleNuevoPresupuesto = (presupuesto) => {
    if(Number(presupuesto) > 0){
      setIsValidPresupuesto(true);
    }else{
      Alert.alert('Error','Presupuesto no puede ser 0 o menor','Ok');
    }
    
  }

  const hendlegasto = gasto => {
    //Object.values(gasto).includes('') para validar todo el objeto que no esten vacios
    if([gasto.nombre, gasto.categoria, gasto.cantidad].includes('')){
      Alert.alert(
        "Error",
        "Todos los campos son obligatorios",
      )

      return;
    }

    if(gasto.id){
      const gastosActualizados = gastos.map( gastoState => gastoState.id === gasto.id ? gasto : gastoState);
      setGastos(gastosActualizados);
    }else{
      gasto.id = generarId();
      gasto.fecha = Date.now();
      setGastos([...gastos, gasto]);
    }
    //Agragar nuevo gastos al state

    
    setModal(!modal);
  }

  const eliminandoGasto = id => {
    Alert.alert(
      'Deseas eliminar este gasto?',
      'Un gasto eliminado no se podra recuperar',
      [
        {text: 'No', style: 'cancel'},
        {text: 'Si, Eliminar', onPress: () => {
          
          const gastosActualizados = gastos.filter(gastoState =>
            gastoState.id !== id)

          setGastos(gastosActualizados);
          setModal(!modal);
          setGasto({});
        }},
      ]
    )
    
  }

  const resetearApp = () => {
    Alert.alert(
      'Deseas resetear la app',
      'Esto eliminara presupuesto y gasto',
      [
        {text: 'No', style: 'cancel'},
        {text: 'Si, Eliminar', onPress: async () => {
          try {
            await AsyncStorage.clear();
            setIsValidPresupuesto(false);
            setPresupuesto(0);
            setGasto([]);
          } catch (error) {
            console.log(error);
          }
        }},
      ]
    )
  }

  return (
    <View style={styles.contenedor}>
      <ScrollView>
          <View style = {styles.header}>
            <Header />
            {isValidPresupuesto ? (
              <ControlPresupuesto
              gastos={gastos}
              presupuesto={presupuesto}
              resetearApp={resetearApp}
              />
            ) : (
              <NuevoPresupuesto 
              presupuesto={presupuesto}
              setPresupuesto={setPresupuesto}
                handleNuevoPresupuesto={handleNuevoPresupuesto}/>
            )}
            
          </View>

          {isValidPresupuesto && (
            <>
              <Filtro
                filtro={filtro}
                setFiltro={setFiltro}
                gastos={gastos}
                setGastoFiltrado={setGastoFiltrado}
              />
              <ListadoGastos
                gastos={gastos}
                setModal={setModal}
                setGasto ={setGasto}
                filtro={filtro}
                gastoFiltrado={gastoFiltrado}
              />
            </>
          )}
      </ScrollView>

      {modal && (
        <Modal
          animationType= 'slide'
          visible={modal}
          onRequestClose={() =>{
            setModal(!modal)
          }}
        >
          <FormularioGasto
            setModal={setModal}
            hendlegasto={hendlegasto}
            gasto={gasto}
            setGasto={setGasto}
            eliminandoGasto={eliminandoGasto}
          />
        </Modal>
      )}
      {isValidPresupuesto && (
        <Pressable 
          style={styles.pressable}
          onPress={() => setModal(!modal)}
        >
          <Image style={styles.imagen}
            source={require('./src/img/nuevo-gasto.png')}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#3B82F6',
    minHeight: 400
  },
  contenedor: {
    backgroundColor: '#F5F5F5',
    flex: 1,
  },
  imagen:{
    height: 60,
    width: 60,
  },
  pressable:{
    height: 60,
    width: 60,
    position: 'absolute',
    bottom: 40,
    right: 30
  }
});

export default App;
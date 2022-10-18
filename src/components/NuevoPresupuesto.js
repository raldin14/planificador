import React from "react";
import { Text, View, StyleSheet,TextInput, Pressable} from 'react-native';
import globalStyles from "../styles";

const NuevoPresupuesto = ({presupuesto,setPresupuesto,handleNuevoPresupuesto}) => {

    return(
        <View style={styles.contenedor}> 
            <Text style={styles.label}>Definir presupuesto</Text>
            <TextInput
                keyboardType="numeric"
                placeholder="Agregar presupuesto ej. 300"
                style={styles.input}
                value={presupuesto.toString()}
                onChangeText={setPresupuesto}
            />
            <Pressable 
                style={styles.boton}
                onPress={() => handleNuevoPresupuesto(presupuesto)}
                >
                <Text style={styles.botonTexto}>Agregar Presupuesto</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    contenedor: {
        ...globalStyles.contenedor
    },
    label: {
        textAlign: 'center',
        fontSize: 24,
        color: '#3B82F6',
    },
    input: {
        backgroundColor: '#F5F5F5',
        padding: 10,
        borderRadius: 10,
        textAlign: 'center',
        marginTop: 30
    },
    boton:{
        marginTop: 30,
        backgroundColor: '#1048A4',
        padding: 10,
        borderRadius: 10
    },
    botonTexto:{
        color: '#FFF',
        textAlign: 'center',
        textTransform: 'uppercase',
        fontWeight: 'bold'
    }
})
export default NuevoPresupuesto;
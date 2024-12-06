import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import axios from 'axios';
import * as LocalAuthentication from 'expo-local-authentication';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [items, setItems] = React.useState([]);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  // Função para autenticar usando impressão digital
  const authenticateUser = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      Alert.alert('Erro', 'Dispositivo não suporta autenticação biométrica');
      return;
    }

    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
    if (supportedTypes.length === 0) {
      Alert.alert('Erro', 'Autenticação biométrica não suportada');
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autentique-se com a impressão digital',
      fallbackLabel: 'Usar senha',
    });

    if (result.success) {
      setIsAuthenticated(true);
      fetchData();  // Busca os dados após a autenticação bem-sucedida
    } else {
      Alert.alert('Falha na autenticação', 'Impressão digital não reconhecida');
    }
  };

  // Função para buscar os dados da API após a autenticação
  const fetchData = () => {
    const ip = '192.168.1.164';  // Seu IP local
    axios.get(`http://${ip}:3000/api/items`)
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar os dados', error);
      });
  };

  return (
    <View style={styles.container}>
      {!isAuthenticated ? (
        <>
          <Text>Você precisa se autenticar para ver os dados.</Text>
          <Button title="Ver os Dados" onPress={authenticateUser} />
        </>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text>{item.title}</Text>
                <Text>{item.description}</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
  },
  card: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    width: '80%',
    alignItems: 'center',
  },
});

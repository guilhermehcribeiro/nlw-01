import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Image, StyleSheet, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityeResponse {
  nome: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  const navigation = useNavigation();

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      city: selectedCity,
      uf: selectedUf,
    });
  }

  const placeholderUf = {
    label: 'Selecione um estado',
    value: null,
    color: '#9EA0A4',
  };

  const placeholderCity = {
    label: 'Selecione uma cidade',
    value: null,
    color: '#9EA0A4',
  };

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
      )
      .then((res) => {
        const ufInitials = res.data.map((uf) => uf.sigla);
        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === '0') {
      setCities([]);
      setSelectedCity('0');
      return;
    }

    axios
      .get<IBGECityeResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((res) => {
        const citiesName = res.data.map((city) => city.nome);
        setCities(citiesName);
      });
  }, [selectedUf]);

  function handleSelectUf(value: string) {
    setSelectedUf(value);
  }

  function handleSelectCity(value: string) {
    setSelectedCity(value);
  }

  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>
          Seu markert place de coleta de resíduos.
        </Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
        </Text>
      </View>

      <View style={styles.footer}>
        <RNPickerSelect
          placeholder={placeholderUf}
          style={pickerSelectStyles}
          onValueChange={handleSelectUf}
          items={ufs.map((uf) => {
            return { label: uf, value: uf };
          })}
        />

        <RNPickerSelect
          placeholder={placeholderCity}
          style={pickerSelectStyles}
          onValueChange={handleSelectCity}
          items={cities.map((city) => {
            return { label: city, value: city };
          })}
        />
        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default Home;

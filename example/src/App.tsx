import * as React from 'react';

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  Platform,
} from 'react-native';
import {
  op_createPaymentUrl,
  OPCurrency,
  op_openWithUrl,
  OPErrorResult,
} from 'react-native-onepay-paygate';

function HomeScreen() {
  const [amount, setAmount] = React.useState<number | undefined>(2000);
  const ACCESS_CODE_PAYGATE = '6BEB2546'; // Onepay send for merchant
  const MERCHANT_PAYGATE = 'TESTONEPAY'; //  Merchant register with onepay
  const HASH_KEY = '6D0870CDE5F24F34F3915FB0045120DB'; // Onepay send for merchant
  // const ACCESS_CODE_PAYGATE = '22772CEF'; // Onepay send for merchant
  // const MERCHANT_PAYGATE = 'TESTONEPAY'; //  Merchant register with onepay
  // const HASH_KEY = '6D0870CDE5F24F34F3915FB0045120DB'; // Onepay send for merchant
  const URL_SCHEMES = 'merchantappscheme'; // get CFBundleURLSchemes in Info.plist
  React.useEffect(() => {
    // multiply(3, 7).then(setResult);
  }, []);
  return (
    <View style={styles.container}>
      <TextInput
        value={`${amount}`}
        onChangeText={(text) => {
          setAmount(Number(text));
        }}
        keyboardType={'number-pad'}
        style={{
          borderWidth: 1,
          borderColor: 'black',
          width: 200,
          marginBottom: 20
        }}
      />
      <TouchableOpacity
        onPress={() => {
          if (!amount) {
            Alert.alert('Thông báo', 'Vui lòng nhập số tiền!');
            return;
          }
          op_createPaymentUrl({
            amount,
            accessCode: ACCESS_CODE_PAYGATE,
            currency: OPCurrency.vnd,
            hashKey: HASH_KEY,
            merchant: MERCHANT_PAYGATE,
            orderInformation: `${MERCHANT_PAYGATE} test`,
            urlSchemes: URL_SCHEMES,
          }).then((value) => {
            console.log('payment url: ' + value.paymentUrl);
            op_openWithUrl(value.paymentUrl, value.returnUrl)
              .then((paymentResult) => {
                console.log(paymentResult);
                if (paymentResult.isSuccess) {
                  if (Platform.OS === 'android') {
                    ToastAndroid.show(
                      'thanh toan thanh cong',
                      ToastAndroid.LONG
                    );
                  } else {
                    Alert.alert('Thong bao', 'thanh toan thanh cong');
                  }
                } else {
                  if (Platform.OS === 'android') {
                    ToastAndroid.show('thanh toan that bai', ToastAndroid.LONG);
                  } else {
                    Alert.alert('Thong bao', 'thanh toan that bai');
                  }
                }
              })
              .catch((error) => {
                Alert.alert(
                  'Thong bao',
                  'Thanh toan that bai: ' +
                    (error as OPErrorResult).errorCase.toString()
                );
              });
          });
        }}
      >
        <View style={{ backgroundColor: 'black', width: 200, height: 50, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{color: 'white'}}>thanh toan</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return <HomeScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});


## Benchmark running Command :

```
npx caliper launch manager --caliper-workspace ./ --caliper-networkconfig networks/fabric/test-network.yaml --caliper-benchconfig benchmarks/ptjsp/config.yaml --caliper-flow-only-test --caliper-fabric-gateway-enabled
```

## Setup

```
git clone https://github.com/hyperledger/caliper-benchmarks
```

```
npm install --only=prod @hyperledger/caliper-cli
```

```
npx caliper bind --caliper-bind-sut fabric:2.2
```

Refer : https://github.com/hyperledger/caliper-benchmarks/blob/main/networks/fabric/README.md

<br>
<b>Note</b> : Remember to change the private key on <code>/fabric-samples/caliper-benchmarks/networks/fabric/test-network.yaml</code> file before running otherwise you will get Error Code 6


# Movie App 2020

React JS Fundamentals Course 2020.08.27

Food component에 fav라는 이름의 property를 kimchi라는 value로 선언
부모 component 에서 자식 component 로 많은 props를 보낼수있다.
component는 대문자로 시작해야된다
복붙은 비효율적이다 동적 데이터를 추가해야 한다.
id는 고유한 props를 만들어주고 react 내부에서만 사용한다 Food 함수에 사용하지 않으니 내부에 작성할 필요가 없다

state는 동적 테이터를 다룰때
setState()를 사용하지 않으면 
새롭게 정의한 state와 render function이 불러와지지 않는다.
---------------------------------------------------------------
import React from 'react';

class App extends React.Component{
// class component render method를 자동적으로 실행한다.
  state = {
    count: 0
  };
  add = () => {
    this.setState(current => ({ count: current.count + 1 }))
  };
  minus = () => {
    this.setState(current => ({ count: current.count - 1 }))
  };
  componentDidMount(){
    console.log("conponent rendered");
  }
  //render가 실행됐을때
  componentDidUpdate(){
    console.log("컴포넌트가 업데이트 될때");
  } 
  //업데이트이후
  componentWillUnmount(){
    console.log("컴포넌트를 떠날때")
  }
  render() {
    console.log("iamrendering");
    return (
        <div>
          <h1>the number is {this.state.count}</h1>
          <button onClick={this.add}>Add</button>
          <button onClick={this.minus}>minus</button>
        </div>
      );
  }
}
export default App;
---------------------------------------------------------------

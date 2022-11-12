// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Test {
  address public caller;

  function test() public {
    caller = msg.sender;
  }
}

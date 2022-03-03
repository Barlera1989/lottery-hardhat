// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lottery {
    address payable public creator;
    bool public isOpen;
    uint public numberOfGames;
    uint public totalAwards;

    struct LotteryInstance {
        address payable  manager;
        address payable[] players;
        uint[] usedTicketsList;
        uint[] tickets;
        mapping (uint => bool) usedTickets;
        mapping (address => uint) yourTicket;
    }

    LotteryInstance[] public lotteryEvent;

    constructor() {
        creator = payable(msg.sender);
        isOpen = false;
        numberOfGames = 0;
        totalAwards = 0;
    }

    function randomRange(uint256 number) public view returns (uint256) {
        LotteryInstance storage currentLottery = lotteryEvent[numberOfGames];
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.timestamp, block.difficulty, currentLottery.players)
                )
            ) % number + 1;
    }

    modifier onlyOwner() {
        LotteryInstance storage currentLottery = lotteryEvent[numberOfGames];
        require(msg.sender == currentLottery.manager);
        _;
    }

    modifier isOpenGame() {
        require(isOpen);
        _;
    }

    modifier isClosedGame() {
        require(!isOpen);
        _;
    }

    event Winner(
       uint ticketNumber,
       address winner
        );

    event LotteryStatus(
        string status
        );

    function createLottery(uint maxPlayers) public isClosedGame {

        uint index = lotteryEvent.length;
        lotteryEvent.push();
        LotteryInstance storage currentLottery = lotteryEvent[index];
        currentLottery.manager = payable(msg.sender);
        
        uint i;
        for (i=1 ; i <= maxPlayers ; i++){
            currentLottery.tickets.push(i);
        }
        isOpen = true;        
        
        emit LotteryStatus("open");
    }


    function enter(uint ticketNumber) public payable {
        LotteryInstance storage currentLottery = lotteryEvent[numberOfGames];

        require(msg.value == 0.01 ether, "entering value is exactly 0.01 ether");
        require(currentLottery.usedTicketsList.length <  currentLottery.tickets.length, "no tickets available");
        require(!currentLottery.usedTickets[ticketNumber], "ticked already taken!");
        require(ticketNumber != 0, "ticket must be a positive number");

        currentLottery.players.push(payable(msg.sender));
        currentLottery.usedTicketsList.push(ticketNumber);
        currentLottery.usedTickets[ticketNumber] = true;
        currentLottery.yourTicket[msg.sender] = ticketNumber;

    }

    function pickWinner() public onlyOwner isOpenGame{
        
        LotteryInstance storage currentLottery = lotteryEvent[numberOfGames];
        //case lottery ends without anybody
        if (currentLottery.players.length > 0) {
            uint index = randomRange(currentLottery.usedTicketsList.length);
            totalAwards = totalAwards + address(this).balance *100 / 125;

            //winners transfers
            currentLottery.players[index].transfer(address(this).balance *100 / 125 );
            creator.transfer(address(this).balance *25/100 );
            currentLottery.manager.transfer(address(this).balance);

            emit Winner(currentLottery.yourTicket[currentLottery.players[index]] , currentLottery.players[index]);
        }
        isOpen = false;
        numberOfGames++;
        emit LotteryStatus("closed");
    }   

    function seeUsedTickets() public view isOpenGame returns (uint[] memory){
        LotteryInstance storage currentLottery = lotteryEvent[numberOfGames];
        return currentLottery.usedTicketsList;
    }

     function seeYourTicket(address yourAddress) public view isOpenGame returns (uint){
         LotteryInstance storage currentLottery = lotteryEvent[numberOfGames];
        return currentLottery.yourTicket[yourAddress];
    }

    function getAllLotteryTickets() public view isOpenGame returns (uint[] memory){
        LotteryInstance storage currentLottery = lotteryEvent[numberOfGames];
        return currentLottery.tickets;
    }

    function getPlayers() public view  isOpenGame returns (address payable[] memory) {
        LotteryInstance storage currentLottery = lotteryEvent[numberOfGames];
        return currentLottery.players;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract Vote {
    // 定义投票人结构体
    struct Voter {
        // --- A. 自身的投票权益 (1票) ---
        bool hasRightToVote; // 我是否有投票权
        bool hasVoted; // 自身是否已投票
        address delegateTo; // 我是否把自己的票委托给了别人 (若为 0x0 则没委托)
        uint16 personalTargetId; // 我自己的这一票投给了哪个候选人ID

        // --- B. 接受的委托权益 (最多3人) ---
        ReceivedDelegation[3] delegations;
    }

    // 我收到的"一份委托"
    struct ReceivedDelegation {
        address delegator; // 谁委托给了我
        uint16 targetId; // 我帮这个人投给了谁 (可以是不同的候选人)
        bool hasVoted; // 我是否已经帮这个人投过票了
    }

    // 候选人的结构体
    struct Candidate {
        uint16 id; // 候选人ID，从1~65535
        string name; // 候选人名称
        uint256 voteCount; // 得票数
    }

    mapping(address => Voter) internal voters; // 投票人映射
    mapping(uint16 => Candidate) internal candidates; // 候选人ID -> Candidate映射
    uint16 internal candidateCount; // 候选人数量

    // 主持人信息
    address public host;

    // 定义事件
    event Voted(address indexed voter, uint16 indexed candidateId, address delegator);
    event VoterAuthorized(address indexed voterAddress);

    // 构造函数
    constructor() {
        host = msg.sender; // 部署合约的人为主持人
    }

    // 修饰符
    modifier onlyHost() {
        require(msg.sender == host, "Only host can perform this action");
        _;
    }

    // 添加候选人
    function addCandidate(string[] calldata _names) public onlyHost {
        for (uint16 i = 0; i < _names.length; i++) {
            _addCandidate(_names[i]);
        }
    }

    function _addCandidate(string calldata _name) internal {
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, _name, 0);
    }

    // 返回所有候选人
    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory candidateList = new Candidate[](candidateCount);
        for (uint16 i = 1; i <= candidateCount; i++) {
            candidateList[i - 1] = candidates[i];
        }
        return candidateList;
    }

    // 给某些地址赋予投票权
    function allocateVotes(address[] calldata addressList) public onlyHost {
        for (uint256 i = 0; i < addressList.length; i++) {
            address voterAddress = addressList[i];
            if (!voters[voterAddress].hasRightToVote) {
                voters[voterAddress].hasRightToVote = true;
                emit VoterAuthorized(voterAddress);
            }
        }
    }

    // 投票
    function vote(uint16 candidateId) public {
        // 这里为什么使用Storage？因为我们需要修改voters映射中的数据
        Voter storage sender = voters[msg.sender];
        require(sender.hasRightToVote, "You have no right to vote");
        require(!sender.hasVoted, "You have already voted");
        require(sender.delegateTo == address(0), "You have delegated your vote to someone else");
        require(candidateId > 0 && candidateId <= candidateCount, "Invalid candidate ID");

        // 记录个人投票
        sender.hasVoted = true;
        sender.personalTargetId = candidateId;
        candidates[candidateId].voteCount += 1;
        emit Voted(msg.sender, candidateId, address(0));

        // 处理收到的委托投票
        for (uint8 i = 0; i < sender.delegations.length; i++) {
            ReceivedDelegation storage delegation = sender.delegations[i];
            if (delegation.delegator != address(0) && !delegation.hasVoted) {
                delegation.hasVoted = true;
                candidates[delegation.targetId].voteCount += 1;
                // 更新委托人的状态
                Voter storage delegatorVoter = voters[delegation.delegator];
                delegatorVoter.hasVoted = true;
                delegatorVoter.personalTargetId = delegation.targetId;
                emit Voted(msg.sender, delegation.targetId, delegation.delegator);
            }
        }
    }

    // 委托投票
    function delegateVote(address to, uint16 targetId) public {
        Voter storage sender = voters[msg.sender];
        require(sender.hasRightToVote, "You have no right to vote");
        require(!sender.hasVoted, "You have already voted");
        require(sender.delegateTo == address(0), "You have already delegated your vote");
        require(targetId > 0 && targetId <= candidateCount, "Invalid candidate ID");

        Voter storage delegatee = voters[to];
        require(to != msg.sender, "Cannot delegate to yourself");
        require(delegatee.hasRightToVote, "Delegatee has no right to vote");
        require(!delegatee.hasVoted, "Delegatee has already voted");

        // 寻找一个空位来存储委托
        bool added = false;
        for (uint8 i = 0; i < delegatee.delegations.length; i++) {
            if (delegatee.delegations[i].delegator == address(0)) {
                delegatee.delegations[i] = ReceivedDelegation(msg.sender, targetId, false);
                added = true;
                break;
            }
        }
        require(added, "Delegatee cannot accept more than 3 delegations");

        // 标记为已委托
        sender.delegateTo = to;
    }

    // 返回当前账户信息
    function getMyInfo() public view returns (Voter memory) {
        return voters[msg.sender];
    }
}

import React from 'react';
import { Table, Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Badge, Row } from 'reactstrap';

import ThreadItem from './thread-item';

export interface IThreadsModalProps {
  showModal: boolean;
  handleClose: (e) => void;
  threadDump: any;
}

export interface IThreadsModalState {
  badgeFilter: string;
  searchFilter: string;
}

export class ThreadsModal extends React.Component<IThreadsModalProps, IThreadsModalState> {
  state: IThreadsModalState = {
    badgeFilter: '',
    searchFilter: ''
  };

  computeFilteredList = () => {
    const { badgeFilter, searchFilter } = this.state;
    let filteredList = this.props.threadDump.threads;
    if (badgeFilter !== '') {
      filteredList = filteredList.filter(t => t.threadState === badgeFilter);
    }
    if (searchFilter !== '') {
      filteredList = filteredList.filter(t => t.lockName && t.lockName.toLowerCase().includes(searchFilter.toLowerCase()));
    }
    return filteredList;
  };

  computeCounters = () => {
    let threadDumpAll = 0;
    let threadDumpRunnable = 0;
    let threadDumpWaiting = 0;
    let threadDumpTimedWaiting = 0;
    let threadDumpBlocked = 0;

    this.props.threadDump.threads.forEach(t => {
      switch (t.threadState) {
        case 'RUNNABLE':
          threadDumpRunnable++;
          break;
        case 'WAITING':
          threadDumpWaiting++;
          break;
        case 'TIMED_WAITING':
          threadDumpTimedWaiting++;
          break;
        case 'BLOCKED':
          threadDumpBlocked++;
          break;
        default:
          break;
      }
    });

    threadDumpAll = threadDumpRunnable + threadDumpWaiting + threadDumpTimedWaiting + threadDumpBlocked;
    return { threadDumpAll, threadDumpRunnable, threadDumpWaiting, threadDumpTimedWaiting, threadDumpBlocked };
  };

  getBadgeClass = threadState => {
    if (threadState === 'RUNNABLE') {
      return 'badge-success';
    } else if (threadState === 'WAITING') {
      return 'badge-info';
    } else if (threadState === 'TIMED_WAITING') {
      return 'badge-warning';
    } else if (threadState === 'BLOCKED') {
      return 'badge-danger';
    }
  };

  updateBadgeFilter = badge => () => this.setState({ badgeFilter: badge });

  updateSearchFilter = event => this.setState({ searchFilter: event.target.value });

  render() {
    const { showModal, handleClose, threadDump } = this.props;
    let counters = {} as any;
    let filteredList = null;
    if (threadDump && threadDump.threads) {
      counters = this.computeCounters();
      filteredList = this.computeFilteredList();
    }

    return (
      <Modal isOpen={showModal} toggle={handleClose} className="modal-lg">
        <ModalHeader toggle={handleClose}>Threads dump</ModalHeader>
        <ModalBody>
          <Badge color="primary" className="hand" onClick={this.updateBadgeFilter('')}>
            All&nbsp;
            <Badge pill>{counters.threadDumpAll || 0}</Badge>
          </Badge>
          &nbsp;
          <Badge color="success" className="hand" onClick={this.updateBadgeFilter('RUNNABLE')}>
            Runnable&nbsp;
            <Badge pill>{counters.threadDumpRunnable || 0}</Badge>
          </Badge>
          &nbsp;
          <Badge color="info" className="hand" onClick={this.updateBadgeFilter('WAITING')}>
            Waiting&nbsp;
            <Badge pill>{counters.threadDumpWaiting || 0}</Badge>
          </Badge>
          &nbsp;
          <Badge color="warning" className="hand" onClick={this.updateBadgeFilter('TIMED_WAITING')}>
            Timed Waiting&nbsp;
            <Badge pill>{counters.threadDumpTimedWaiting || 0}</Badge>
          </Badge>
          &nbsp;
          <Badge color="danger" className="hand" onClick={this.updateBadgeFilter('BLOCKED')}>
            Blocked&nbsp;
            <Badge pill>{counters.threadDumpBlocked || 0}</Badge>
          </Badge>
          &nbsp;
          <div className="mt-2">&nbsp;</div>
          <Input type="text" className="form-control" placeholder="Filter by Lock Name..." onChange={this.updateSearchFilter} />
          <div style={{ padding: '10px' }}>
            {filteredList
              ? filteredList.map((threadDumpInfo, i) => (
                  <div key={`dump-${i}`}>
                    <h6>
                      {' '}
                      <span className={'badge ' + this.getBadgeClass(threadDumpInfo.threadState)}>{threadDumpInfo.threadState}</span>
                      &nbsp;
                      {threadDumpInfo.threadName} (ID {threadDumpInfo.threadId}
                      )&nbsp;
                    </h6>
                    <ThreadItem threadDumpInfo={threadDumpInfo} />
                    <Row>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Blocked Time</th>
                            <th>Blocked Count</th>
                            <th>Waited Time</th>
                            <th>Waited Count</th>
                            <th>Lock Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr key={threadDumpInfo.lockName}>
                            <td>{threadDumpInfo.blockedTime}</td>
                            <td>{threadDumpInfo.blockedCount}</td>
                            <td>{threadDumpInfo.waitedTime}</td>
                            <td>{threadDumpInfo.waitedCount}</td>
                            <td className="thread-dump-modal-lock" title={threadDumpInfo.lockName}>
                              <code>{threadDumpInfo.lockName}</code>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Row>
                  </div>
                ))
              : null}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ThreadsModal;

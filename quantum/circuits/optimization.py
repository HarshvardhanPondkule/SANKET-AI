import cirq
import numpy as np
from typing import List, Dict, Tuple

class ResourceOptimizationCircuit:
    """
    QAOA (Quantum Approximate Optimization Algorithm) circuit
    for resource allocation optimization
    """
    
    def __init__(self, num_villages: int):
        self.num_villages = num_villages
        self.qubits = cirq.LineQubit.range(num_villages)
        self.simulator = cirq.Simulator()
    
    def build_qaoa_circuit(
        self,
        village_priorities: List[float],
        depth: int = 2,
        gamma: float = None,
        beta: float = None
    ) -> cirq.Circuit:
        """
        Build QAOA circuit for optimization
        
        Args:
            village_priorities: Priority score for each village
            depth: QAOA circuit depth (p parameter)
            gamma: Cost Hamiltonian parameter
            beta: Mixer Hamiltonian parameter
        """
        if gamma is None:
            gamma = np.pi / 4
        if beta is None:
            beta = np.pi / 8
        
        circuit = cirq.Circuit()
        
        # Initial state: Equal superposition
        circuit.append(cirq.H.on_each(*self.qubits))
        
        # QAOA layers
        for layer in range(depth):
            # Cost Hamiltonian (encode priorities)
            for i, priority in enumerate(village_priorities):
                if i < len(self.qubits):
                    # Rotation proportional to priority
                    angle = gamma * priority
                    circuit.append(cirq.rz(angle)(self.qubits[i]))
            
            # Interaction terms (neighboring villages)
            for i in range(len(self.qubits) - 1):
                circuit.append(cirq.CZ(self.qubits[i], self.qubits[i + 1]))
            
            # Mixer Hamiltonian (exploration)
            for qubit in self.qubits:
                circuit.append(cirq.rx(beta)(qubit))
        
        # Measurement
        circuit.append(cirq.measure(*self.qubits, key='allocation'))
        
        return circuit
    
    def optimize_allocation(
        self,
        villages: List[Dict],
        resources: Dict,
        iterations: int = 50
    ) -> List[Dict]:
        """
        Optimize resource allocation using QAOA
        
        Returns optimized allocation plan
        """
        # Extract priorities
        priorities = [v.get('outbreak_belief', 0.5) for v in villages[:self.num_villages]]
        
        best_allocation = None
        best_cost = float('inf')
        
        # Run multiple iterations with different parameters
        for i in range(iterations):
            # Vary QAOA parameters
            gamma = np.pi * np.random.uniform(0.1, 0.5)
            beta = np.pi * np.random.uniform(0.1, 0.5)
            
            # Build and run circuit
            circuit = self.build_qaoa_circuit(priorities, depth=2, gamma=gamma, beta=beta)
            result = self.simulator.run(circuit, repetitions=10)
            measurements = result.measurements['allocation']
            
            # Extract allocation from measurements
            allocation = self._extract_allocation(measurements, villages, resources)
            
            # Calculate cost
            cost = self._calculate_cost(allocation, priorities)
            
            if cost < best_cost:
                best_cost = cost
                best_allocation = allocation
        
        return best_allocation
    
    def _extract_allocation(
        self,
        measurements: np.ndarray,
        villages: List[Dict],
        resources: Dict
    ) -> List[Dict]:
        """
        Extract resource allocation from quantum measurements
        """
        # Average measurements to get allocation weights
        allocation_weights = np.mean(measurements, axis=0)
        
        # Normalize weights
        total_weight = np.sum(allocation_weights)
        if total_weight > 0:
            normalized_weights = allocation_weights / total_weight
        else:
            normalized_weights = np.ones(len(allocation_weights)) / len(allocation_weights)
        
        # Create allocation plan
        allocations = []
        for i, village in enumerate(villages[:len(normalized_weights)]):
            weight = normalized_weights[i]
            
            allocations.append({
                'village': village.get('name', f'Village {i}'),
                'village_id': village.get('village_id', f'v{i}'),
                'priority_score': float(village.get('outbreak_belief', 0.5)),
                'allocation_weight': float(weight),
                'ors_packets': int(weight * resources.get('ors', 1000)),
                'medical_staff': int(weight * resources.get('staff', 50)),
                'test_kits': int(weight * resources.get('kits', 500)),
                'optimization_method': 'QAOA'
            })
        
        # Sort by allocation weight
        allocations.sort(key=lambda x: x['allocation_weight'], reverse=True)
        
        return allocations
    
    def _calculate_cost(self, allocation: List[Dict], priorities: List[float]) -> float:
        """
        Calculate cost function for allocation
        Lower cost = better allocation
        """
        cost = 0.0
        
        for i, alloc in enumerate(allocation):
            if i < len(priorities):
                priority = priorities[i]
                weight = alloc['allocation_weight']
                
                # Cost increases if high-priority village gets low allocation
                cost += abs(priority - weight)
        
        return cost
